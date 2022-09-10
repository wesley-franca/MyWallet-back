import express from "express";
import cors from "cors";
import joi from "joi";
import { stripHtml } from "string-strip-html";
import db from "./mongo.js"
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";



const server = express();
server.use(express.json());
server.use(cors());

const newUserSchema = joi.object({
	name: joi.string().required().trim(),
	email: joi.string().email().trim().required(),
	password: joi.string().trim().required()
});
const userSchema = joi.object({
	email: joi.string().email().trim().required(),
	password: joi.string().trim().required()
});

server.post("/registration", async (req, res) => {
	let user;
	const { name, email, password } = req.body;
	const newUser = {
		name: stripHtml(name).result,
		email: stripHtml(email).result,
		password: stripHtml(password).result
	};
	const validation = newUserSchema.validate(newUser, { abortEarly: false });

	if (validation.error) {
		return res.status(422).send(validation.error.message);
	} else {
		const hashPassword = bcrypt.hashSync(password, 10);
		newUser.password = hashPassword;
		try {
			user = await db.collection("users").findOne({ email: newUser.email });
		} catch (error) {
			console.log(error);
			return res.sendStatus(500);
		}
		if (user !== null) {
			return res.status(409).send("E-mail ja cadastrado");
		} else {
			try {
				await db.collection("users").insertOne(newUser);
				res.sendStatus(201);
			} catch (error) {
				console.log(error.message);
				return res.sendStatus(500);
			}
		}
	}
});


server.post("/login", async (req, res) => {
	const { email, password } = req.body;
	let authentication = false;
	let registeredUser;
	const user = {
		email: stripHtml(email).result,
		password: stripHtml(password).result
	};
	const validation = userSchema.validate(user, { abortEarly: false });

	if (validation.error) {
		return res.status(422).send(validation.error.message);
	} else {
		try {
			registeredUser = await db.collection("users").findOne({ email: user.email });
			if (registeredUser === null) {
				return res.status(403).send("email ou senha estão incorretos");
			} else{
				authentication = bcrypt.compareSync(user.password, registeredUser.password);
			}
		} catch (error) {
			console.log(error.message);
			return res.sendStatus(500);
		}
		if (authentication) {
			const token = uuidv4();
			const { _id } = registeredUser;
			try {
				const existentSession = await db.collection("sessions").findOne({ userId: `ObjectId(${_id})` });
				if (existentSession !== null) {
					await db.collection("sessions").updateOne({ userId: `ObjectId(${_id})` }, { $set: { token: token } });
				} else {
					await db.collection("sessions").insertOne({ userId: `ObjectId(${_id})`, token: token });
				}
			} catch (error) {
				console.log(error.message);
				return res.sendStatus(500);
			}
			return res.status(200).send(token);
		} else{
			return res.status(403).send("email ou senha estão incorretos");
		}
	}
})


server.listen(5000, () => { console.log("listen on 5000") });
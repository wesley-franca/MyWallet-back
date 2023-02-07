import { stripHtml } from "string-strip-html";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import db from "../database/Mongo.js";
import { newUserSchema, userSchema } from "../schemas/authSchemas.js";

const registration = async (req, res) => {
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
			return res.status(409).send("Este endereço de e-mail já possui um cadastro.");
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
};

const login = async (req, res) => {
	const { email, password } = req.body;
	let authentication = false;
	let registeredUser;
	let username;
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
			} else {
				authentication = bcrypt.compareSync(user.password, registeredUser.password);
				username = registeredUser.name;
			}
		} catch (error) {
			console.log(error.message);
			return res.sendStatus(500);
		}
		if (authentication) {
			const token = uuidv4();
			const { _id } = registeredUser;
			try {
				const existentSection = await db.collection("sections").findOne({ userId: `ObjectId(${_id})` });
				if (existentSection !== null) {
					await db.collection("sections").updateOne({ userId: `ObjectId(${_id})` }, { $set: { token: token } });
				} else {
					await db.collection("sections").insertOne({ userId: `ObjectId(${_id})`, token: token });
				}
			} catch (error) {
				console.log(error.message);
				return res.sendStatus(500);
			}
			return res.status(200).send({ token, _id, username });
		} else {
			return res.status(403).send("email ou senha estão incorretos");
		}
	}
};

const logout = async (req, res) => {
	let section;
	const userId = req.headers.user;
	try {
		section = await db.collection("sections").findOne({ userId: `ObjectId(${userId})` });
	} catch (error) {
		console.log(error);
		return res.sendStatus(500);
	}
	if (section !== null) {
		try {
			await db.collection("sections").deleteOne({ userId: `ObjectId(${userId})` });
			res.sendStatus(200);
		} catch (error) {
			console.log(error);
			return res.sendStatus(500);
		}
	} else {
		return res.sendStatus(404);
	}
};

export { registration, login, logout };
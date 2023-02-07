import db from "../database/Mongo.js";
import joi from "joi";
import dayjs from "dayjs";
import {ObjectId} from "mongodb";

const time = dayjs(new Date()).format("DD/MM");
const movimentationSchema = joi.object({
    type: joi.string().required().valid("Entrada", "Saida").trim(),
    value: joi.number().required(),
    description: joi.string().min(2).max(30).required().trim()
});

const createMovimentation = async (req, res) => {
    let section;
    const body = req.body;
    const userId = req.headers.user;
    const token = req.headers.authorization.replace("Bearer ", "");
    const validation = movimentationSchema.validate(body, { abortEarly: false });

    if (validation.error) {
        return res.status(422).send(validation.error.message);
    } else {
        try {
            section = await db.collection("sections").findOne({ userId: `ObjectId(${userId})` });
        } catch (error) {
            console.log(error);
            return res.sendStatus(500);
        }
        if (section !== null) {
            if (section.token === token) {
                try {
                    body.time = time;
                    await db.collection("movimentation").insertOne({ body, userId: `ObjectId(${userId})` })
                    return res.sendStatus(201);
                } catch (error) {
                    console.log(error);
                    return res.sendStatus(500);
                }
            } else {
                return res.sendStatus(401);
            }
        } else {
            return res.sendStatus(404);
        }
    }
};

const listMovimentations = async (req, res) => {
    let section;
    let movimentationsArray;
    const userId = req.headers.user;
    const token = req.headers.authorization.replace("Bearer ", "");
    try {
        section = await db.collection("sections").findOne({ userId: `ObjectId(${userId})` });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
    if (section !== null) {
        if (section.token === token) {
            try {
                movimentationsArray = await db.collection("movimentation").find({ userId: `ObjectId(${userId})` }).toArray();
                return res.status(200).send(movimentationsArray);
            } catch (error) {
                console.log(error);
                return res.sendStatus(500);
            }
        } else {
            return res.sendStatus(401);
        }
    } else {
        return res.sendStatus(404);
    }
};

const deleteMovimentation = async (req, res) => {
    let section;
    const userId = req.headers.user;
    const token = req.headers.authorization.replace("Bearer ", "");
    const movimentationId = req.headers.movimentationid;
    try {
        section = await db.collection("sections").findOne({ userId: `ObjectId(${userId})` });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
    if (section !== null) {
        if (section.token === token) {
            try {
                await db.collection("movimentation").deleteOne({ _id : ObjectId(movimentationId) });
                return res.sendStatus(200);
            } catch (error) {
                console.log(error);
                return res.sendStatus(500);
            }
        } else {
            return res.sendStatus(401);
        }
    } else {
        return res.sendStatus(404);
    }
};

export { createMovimentation, listMovimentations, deleteMovimentation };
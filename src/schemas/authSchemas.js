import joi from "joi";

export const newUserSchema = joi.object({
	name: joi.string().required().trim(),
	email: joi.string().email().trim().required(),
	password: joi.string().trim().required()
});

export const userSchema = joi.object({
	email: joi.string().email().trim().required(),
	password: joi.string().trim().required()
});
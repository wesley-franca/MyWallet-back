import joi from "joi";

export const movimentationSchema = joi.object({
  type: joi.string().required().valid("Entrada", "Saida").trim(),
  value: joi.number().required(),
  description: joi.string().min(2).max(30).required().trim()
});
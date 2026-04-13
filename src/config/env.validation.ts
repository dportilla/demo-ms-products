import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
	// App
	PORT: Joi.number().required(),

	// Database
	DATABASE_URL: Joi.string().required(),
}).unknown(true);

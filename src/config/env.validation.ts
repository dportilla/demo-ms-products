import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
	// App
	PORT: Joi.number().required(),
	ALLOWED_ORIGINS: Joi.string().required(),

	// Database
	DATABASE_URL: Joi.string().required(),
}).unknown(true);

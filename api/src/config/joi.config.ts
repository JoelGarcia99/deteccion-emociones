/**
 * this will help to validate the schema of required env variables
* NOTE: this import must not be converted into a traditional import
 */
import * as Joi from "joi";

export const joiValidationSchema = Joi.object({
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().default(5432),
  DB_USER: Joi.string().default('postgres'),
  DB_PASSWORD: Joi.string().default('postgres'),
  DB_NAME: Joi.string().required(),

  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION_TIME: Joi.string().default('30d'),
  JWT_REFRESH_EXPIRATION_TIME: Joi.string().default('60d'),

  API_PORT: Joi.number().default(8500),
  API_HOST: Joi.string().default('localhost'),
});

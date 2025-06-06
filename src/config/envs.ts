
import 'dotenv/config';
import * as joi from 'joi'
import { env } from 'process';

interface EnvVars {
    PORT: number;
    STRIPE_SECRET_KEY: string;
    STRIPE_SUCCESS_URL: string;
    STRIPE_CANCEL_URL: string;
    STRIPE_ENDPOINT_SECRET: string;
    NATS_SERVERS: string[];
    MAIL_SECRET_KEY: string;
}

const envsSchema = joi.object({
    PORT: joi.number().required(),
    STRIPE_SECRET_KEY: joi.string().required(),
    STRIPE_SUCCESS_URL: joi.string().required(),
    STRIPE_CANCEL_URL: joi.string().required(),
    STRIPE_ENDPOINT_SECRET: joi.string().required(),
    MAIL_SECRET_KEY: joi.string().required(),
    NATS_SERVERS:joi.array().items(joi.string()).required()
}).unknown(true)

const {error, value} = envsSchema.validate({...process.env, NATS_SERVERS: process.env.NATS_SERVERS?.split(',')})


if (error) {
    throw new Error(`Config validation error: ${error.message}`)
}

const envVars: EnvVars = value
export const envs = {
    port: envVars.PORT,
    stripeSecretKey: envVars.STRIPE_SECRET_KEY,
    stripeSuccessUrl: envVars.STRIPE_SUCCESS_URL,
    stripeCancelUrl: envVars.STRIPE_CANCEL_URL,
    stripeEndPointSecret: envVars.STRIPE_ENDPOINT_SECRET,
    nasts_servers: envVars.NATS_SERVERS,
    mail_secret_key: envVars.MAIL_SECRET_KEY,
}
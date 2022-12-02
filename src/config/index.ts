import { config } from "dotenv-safe";

export interface MongoConfig {
    uri: string
}
export interface Config {
    env: string,
    apiPort: number | string,
    port: number | string,
    mongo: MongoConfig
    secret: string,
    jwtSecret: string,
    jwtTokenExpiry: string
}

config();
const env = process.env.NODE_ENV || 'development';
const apiPort = process.env.APIPORT || 5000;
const port = process.env.PORT || 5000;
const mongo: MongoConfig = {
    uri: process.env.MONGO_URI
}
const secret = process.env.SECRET_MESSAGE;
const jwtTokenExpiry = process.env.JWTTOKENEXPIRY;
const jwtSecret = process.env.JWTSECRET;


const appConfig: Config = {
    env,
    apiPort,
    port,
    mongo,
    secret,
    jwtSecret,
    jwtTokenExpiry,
}

export {
    appConfig
};
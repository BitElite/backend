import { config } from "dotenv-safe";
import { Algorithm } from "jsonwebtoken"

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
    jwtAlgorithm: Algorithm
}

config();
const env = process.env.NODE_ENV || 'development';
const apiPort = process.env.APIPORT || 5000;
const port = process.env.PORT || 5000;
const mongo: MongoConfig = {
    uri: process.env.MONGO_URI
}
const secret = process.env.SECRET_MESSAGE;
const jwtTokenExpiry = process.env.JWT_TOKEN_EXPIRY;
const jwtSecret = process.env.JWT_SECRET;
const jwtAlgorithm: Algorithm = "HS256";


const appConfig: Config = {
    env,
    apiPort,
    port,
    mongo,
    secret,
    jwtSecret,
    jwtTokenExpiry,
    jwtAlgorithm
}

export {
    appConfig
};
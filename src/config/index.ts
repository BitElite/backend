import { config } from "dotenv-safe";

export interface Config {
    env: string,
    apiPort: number | string,
    port: number | string
}

config();
const env = process.env.NODE_ENV || 'development';
const apiPort = process.env.APIPORT || 5000;
const port = process.env.PORT || 5000;

const appConfig: Config = {
    env,
    apiPort,
    port
}
export {
    appConfig
};
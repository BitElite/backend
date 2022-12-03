import * as express from 'express';
import { appConfig } from './config'
import * as cors from 'cors';
import { json, urlencoded } from 'body-parser';
import * as logger from "./commons/logger";
import * as error from "./commons/errorHandler"
import * as routes from "./routes"
import mongoose from "./commons/mongoose";
//@ts-ignore
import DedupService from './services/dedup.service';

const app = express();

app.use(json());

app.use(urlencoded({ extended: true }));

app.use(cors());

app.use(express.static('client'))

//define api server routes here
app.use(routes)

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use("*", error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);


const startWithPort = async (port: Number) => {
    try {
        logger.info("Starting Api server .......");
        //connect to mongodb
        await mongoose.connect()
        app.listen(port, () => logger.info(`Api Server listening on port : ${port}`));
    } catch (e) {
        console.log(e);
        logger.error("Error starting api server", e.message || e);
        process.exit(1);
    }

}

const start = async () => {
    let port = Number(appConfig.apiPort)
    await startWithPort(port);
    const dedupService = new DedupService()
    await dedupService.getPrice()
}

export {
    app,
    start,
    startWithPort
}

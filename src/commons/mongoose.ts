import * as mongoose from "mongoose";
import { appConfig } from "./../config";
import * as logger from './../commons/logger'
/**
 * Connect to mongo db
 *
 * @returns {object} Mongoose connection
 * @public
 */
export default {
    connect : async () => {
        try{
            // Exit applications on error
            mongoose.connection.on("error", (err) => {
                process.exit(-1);
            });

            // print mongoose logs in dev env
            if (appConfig.env === "development") {
                mongoose.set("debug", true);
            }

            await mongoose.connect(appConfig.mongo.uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false
            })
            logger.info("Mongodb Connection established ")
            return mongoose.connection;
        }catch (e){
            console.log(e);
            //logger.error("Mongo connection error", e.message || e);
        }
    }
}

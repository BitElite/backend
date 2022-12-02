import * as winston from 'winston';
const logger: winston.Logger = winston.createLogger({
    format: winston.format.json(),
    transports: [
        new winston.transports.Console({ level: 'info' }),
    ],
});

export = logger
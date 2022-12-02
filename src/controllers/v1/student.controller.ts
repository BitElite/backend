import { Request, Response, NextFunction } from "express";

const helloWorld = async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.send({
            success: true,
            data: "Hello World!"
        })
    } catch (e) {
        console.log(e);
        return next(e);
    }
}

export {
    helloWorld
}
import { Request, Response, NextFunction } from "express";
import UserService from "../../services/user.service";
import { UserModel, User } from "../../models/user/user.model";
const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    let userService = new UserService(new UserModel());
    try{
        let payload = req.body
        let user = await userService.upsertUser(payload);
        let token = userService.getUserToken(user);
        return res.send({
            success: true,
            data: {
                user,
                token
            }
        })
    }catch (e){
        console.log(e);
        return next(e)
    }
}

const hello = async (req: Request, res: Response, next: NextFunction) => {
    return res.send({
        success: true,
        data: "Hello from protected route"
    })
}

export {
    loginUser,
    hello
}
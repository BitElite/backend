import { Request, Response, NextFunction } from "express";
import UserService from "../../services/user.service";
import { UserModel } from "../../models/user/user.model";
const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    let userService = new UserService(new UserModel());
    try{
        let payload = req.body
        let user = await userService.upsertUser(payload);
        return res.send({
            success: true,
            data: {
                user
            }
        })
    }catch (e){
        console.log(e);
        return next(e)
    }
}

export {
    loginUser
}
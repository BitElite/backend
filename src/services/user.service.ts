import { UserModel, User } from "../models/user/user.model";
import { ApiError } from "../commons/APIError";
import { connectionErrors } from "../constants";
import { isEmpty, isNull } from "lodash";
import { appConfig } from "../config";
import { ethers } from "ethers";
import * as jwt from "jsonwebtoken";


export default class UserService {
    user: UserModel
    constructor(user: UserModel) {
        this.user = user;
    }

    upsertUser(payload: any) {
        return new Promise(async (resolve, reject) => {
            try {
                // verify signed message using ethers and get address
                const address = ethers.utils.verifyMessage(appConfig.secret, payload.signed_msg);

                console.log(`address --> ${address}`)
                if (!address) {
                    return reject(new ApiError(connectionErrors.UNAUTHORIZED, 401, [{
                        signed_msg: "is not valid"
                    }]));
                }
                let user: any = await this.user.findOne({ deleted: false, walletAddress: address }, { deleted: 0 });
                if (isNull(user)) {
                    user = {};
                    user.walletAddress = address;
                    user.created_at = new Date();
                    user = await this.user.save(user);
                }
                return resolve(user);
            } catch (e) {
                return reject(e)
            }
        })
    }
}
import * as express from 'express';
import validateRequest = require("../../middlewares/validateSchema");
import * as Joi from "joi";
import {loginUser} from './../../controllers/v1/user.controller'
import {globals} from './../../constants'

const router = express.Router();

const UserDTO = Joi.object({
    signed_msg:  Joi.string().required(),
})

router.post('/user', validateRequest(UserDTO), loginUser);

export = router;
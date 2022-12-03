import * as express from 'express';
import validateRequest = require("../../middlewares/validateSchema");
import * as Joi from "joi";
import {loginUser, hello} from './../../controllers/v1/user.controller'
import {globals} from './../../constants'
import isAuth from '../../middlewares/isAuth';

const router = express.Router();

const UserDTO = Joi.object({
    signed_msg:  Joi.string().required(),
})

router.post('/user', validateRequest(UserDTO), loginUser);
router.get('/hello', isAuth, hello);

export = router;
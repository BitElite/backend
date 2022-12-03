import * as express from 'express';
import validateRequest = require("../../middlewares/validateSchema");
import * as Joi from "joi";
const router = express.Router();
import {fileHandler} from "../../middlewares/fileHandler";
import * as multer from 'multer'
import isAuth from '../../middlewares/isAuth';
import {createAsset, readAsset} from "../../controllers/v1/asset.controller";
const fs = require("fs");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let filePath =  './uploads'
        fs.mkdirSync(filePath, { recursive: true })
        cb(null, filePath)
    },

    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.').pop())
    }
})
  
const upload = multer({ storage: storage })

router.get('/asset/:ipfs_cid', isAuth, readAsset);

router.post('/asset', isAuth, upload.array("files", 1), fileHandler, createAsset);


export = router;

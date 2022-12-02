import * as express from "express";
const router = express.Router();

import * as v1Routes from './v1';

router.use('/v1', v1Routes);

export = router

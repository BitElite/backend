import * as express from "express";
import * as userRoutes from "./user.route"
import * as assetRoutes from "./asset.route"
const router = express.Router();

// user routes
router.use(userRoutes);
router.use(assetRoutes);

export = router
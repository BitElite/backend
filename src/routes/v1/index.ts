import * as express from "express";
import * as userRoutes from "./user.route"
const router = express.Router();

// user routes
router.use(userRoutes);

export = router
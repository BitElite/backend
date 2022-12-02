import * as express from "express";
import * as studentRoutes from "./student.route"
const router = express.Router();

// student routes
router.use(studentRoutes);

export = router
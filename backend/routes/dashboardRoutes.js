import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getHealthSnapshot } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/snapshot", protect, getHealthSnapshot);

export default router;

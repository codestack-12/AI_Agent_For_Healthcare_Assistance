import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getHistory, sendMessage, clearHistory } from "../controllers/chatController.js";

const router = express.Router();

router.get("/history", protect, getHistory);
router.post("/", protect, sendMessage);
router.delete("/history", protect, clearHistory);

export default router;

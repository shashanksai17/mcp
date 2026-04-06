import { Router } from "express";
import { getDepth, getLivePrice, getOHLC, signal, trade } from "../controllers/mcpController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);
router.get("/price", getLivePrice);
router.get("/orderbook", getDepth);
router.get("/candles", getOHLC);
router.post("/trade", trade);
router.get("/signal", signal);

export default router;

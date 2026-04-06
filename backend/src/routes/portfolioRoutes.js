import { Router } from "express";
import { deleteTrade, getPortfolio, getTrades, updateTradeTag } from "../controllers/portfolioController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);
router.get("/", getPortfolio);
router.get("/trades", getTrades);
router.patch("/trades/:id", updateTradeTag);
router.delete("/trades/:id", deleteTrade);

export default router;

import { Router } from "express";
import { deleteMe, getMe, updateMe } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);
router.get("/me", getMe);
router.put("/me", updateMe);
router.delete("/me", deleteMe);

export default router;

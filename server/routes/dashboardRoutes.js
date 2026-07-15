import express from "express";
import { sellerDashboard } from "../controllers/dashboardController.js";
import { protect } from "../middleware/authMiddleware.js";
import {buyerDashboard,} from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/seller", protect, sellerDashboard);
router.get("/buyer", protect, buyerDashboard);
export default router;
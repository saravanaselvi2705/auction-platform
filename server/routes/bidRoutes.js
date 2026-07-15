import express from "express";
import {
  placeBid,
  getBidHistory,
} from "../controllers/bidController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Place Bid
router.post("/:id", protect, placeBid);

// Bid History
router.get("/:id", getBidHistory);

export default router;
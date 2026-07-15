import express from "express";
import { closeAuction } from "../controllers/productController.js";

import {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Protected Routes
router.post("/", protect, addProduct);
router.put("/:id", protect, updateProduct);
router.put("/:id/close", protect, closeAuction);
router.delete("/:id", protect, deleteProduct);

export default router;
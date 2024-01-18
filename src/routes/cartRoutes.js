import express from "express";
import { isAdmin, isAuth } from "../middlewares/authMiddleware.js";
import {
  createCartController,
  deleteCartController,
  getCartController,
} from "../controllers/cartController.js";

const router = express.Router();

router.get("/get-cart", isAuth, getCartController);

router.post("/create-cart", isAuth, createCartController);

router.delete("/delete/:id", isAuth, deleteCartController);

export default router;

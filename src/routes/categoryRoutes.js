import express from "express";
import { isAdmin, isAuth } from "../middlewares/authMiddleware.js";
import {
  createCategory,
  deleteCategoryController,
  getAllCategoryController,
  updateCategoryController,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/create", isAuth, isAdmin, createCategory);

router.get("/get-all", getAllCategoryController);

router.delete("/delete/:id", isAuth, isAdmin, deleteCategoryController);

router.put("/update/:id", isAuth, isAdmin, updateCategoryController);

export default router;

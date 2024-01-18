import express from "express";
import {
  createProductController,
  deleteProductController,
  deleteProductImageController,
  getAllProductController,
  getSingleProductController,
  getTopProductController,
  productReviewController,
  updateProductController,
  updateProductImageController,
} from "../controllers/productController.js";
import { isAdmin, isAuth } from "../middlewares/authMiddleware.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.get("/get-all", getAllProductController);

router.get("/top", getTopProductController);

router.get("/:id", getSingleProductController);

router.post(
  "/createProduct",
  isAuth,
  isAdmin,
  singleUpload,
  createProductController
);

router.put("/update/:id", isAuth, isAdmin, updateProductController);

router.patch(
  "/update/:id",
  isAuth,
  isAdmin,
  singleUpload,
  updateProductImageController
);

router.delete(
  "/delete-image/:id",
  isAuth,
  isAdmin,
  deleteProductImageController
);

router.delete("/delete/:id", isAuth, isAdmin, deleteProductController);

//review product
router.put("/review/:id", isAuth, productReviewController);

export default router;

import express from "express";
import { isAdmin, isAuth } from "../middlewares/authMiddleware.js";
import {
  changeOrderStatusController,
  createOrderController,
  getAllOrderController,
  getMyOrdersController,
  getSingleOrderController,
  paymentsController,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/create", isAuth, isAdmin, createOrderController);

router.get("/my-orders", isAuth, isAdmin, getMyOrdersController);

//get single order
router.get("/my-orders/:id", isAuth, isAdmin, getSingleOrderController);

router.post("/payments", isAuth, isAdmin, paymentsController);

// admin part
router.get("/admin/get-all-orders", isAuth, isAdmin, getAllOrderController);

router.put("/admin/order/:id", isAuth, isAdmin, changeOrderStatusController);

export default router;

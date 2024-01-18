import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import { stripe } from "../server.js";

export const createOrderController = async (req, res) => {
  try {
    const {
      shippingInfo,
      orderItems,
      paymentMethod,
      paymentInfo,
      itemPrice,
      tax,
      shippingCharges,
      totalAmount,
    } = req.body;

    // if (
    //   [
    //     shippingInfo,
    //     orderItems,
    //     paymentMethod,
    //     paymentInfo,
    //     itemPrice,
    //     tax,
    //     shippingCharges,
    //     totalAmount,
    //   ].some((fields) => fields?.trim() === "")
    // ) {
    //   return res.status(401).json({
    //     success: false,
    //     message: "please provide all fields",
    //   });
    // }

    const order = await Order.create({
      user: req.user._id,
      shippingInfo,
      orderItems,
      paymentMethod,
      paymentInfo,
      itemPrice,
      tax,
      shippingCharges,
      totalAmount,
    });

    //update stock
    for (let i = 0; i < orderItems.length; i++) {
      //find product
      const product = await Product.findById(orderItems[i].product);
      product.stock -= orderItems[i].quantity;
      await product.save();
    }
    res.status(200).json({
      success: true,
      message: "order placed successfully",
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: "error in create order api..",
    });
  }
};

export const getMyOrdersController = async (req, res) => {
  try {
    //find order
    const orders = await Order.find({ user: req.user._id });

    if (!orders) {
      return res.status(401).json({
        success: false,
        message: "no orders found",
      });
    }
    res.status(200).json({
      success: true,
      message: "your orders data fetched ",
      totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: "error in get my orders  api..",
    });
  }
};

export const getSingleOrderController = async (req, res) => {
  try {
    const orders = await Order.findById(req.params.id);

    if (!orders) {
      return res.status(401).json({
        success: false,
        message: "no orders found",
      });
    }

    res.status(200).json({
      success: true,
      message: "your orders  fetched ",
      //totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    console.log(error);
    if (error.name === "castError") {
      return res.status(500).send({
        success: false,
        message: "invalid  id.",
      });
    }
    res.status(401).json({
      success: false,
      message: "error in get single orders  api..",
    });
  }
};

export const paymentsController = async (req, res) => {
  try {
    const { totalAmount } = req.body;
    if (!totalAmount) {
      return res.status(401).json({
        success: false,
        message: "total amount required",
      });
    }

    const { client_secret } = await stripe.paymentIntents.create({
      amount: Number(totalAmount * 100),
      currency: "usd",
    });
    res.status(200).json({
      success: true,
      client_secret,
      //totalOrders: orders.length,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "error in payments  api..",
    });
  }
};

export const getAllOrderController = async (req, res) => {
  try {
    const orders = await Order.find({});

    res.status(200).json({
      success: true,
      message: "all orders  fetched ",
      totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "error in get all orders  api..",
    });
  }
};

export const changeOrderStatusController = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(401).json({
        success: false,
        message: "order required",
      });
    }
    if (order.orderStatus === "processing") order.orderStatus = "shipped";
    else if (order.orderStatus === "shipped") {
      order.orderStatus = "delivered";
      order.deliveredAt = Date.now();
    } else {
      return res.status(401).json({
        success: false,
        message: "order already delivered",
      });
    }
    res.status(200).json({
      success: true,
      message: "order status  updated ",
    });
  } catch (error) {
    if (error.name === "castError") {
      return res.status(500).send({
        success: false,
        message: "invalid  id.",
      });
    }
    res.status(401).json({
      success: false,
      message: "error in change order status  api..",
    });
  }
};

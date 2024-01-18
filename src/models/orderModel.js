import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    shippingInfo: {
      address: {
        type: String,
        required: [true, "address is required"],
      },
      city: {
        type: String,
        required: [true, "city is required"],
      },
      country: {
        type: String,
        required: [true, "country is required"],
      },
    },
    orderItems: [
      {
        name: {
          type: String,
          required: [true, "product name is required"],
        },
        price: {
          type: String,
          required: [true, "product price  is required"],
        },
        quantity: {
          type: String,
          required: [true, "product quantity  is required"],
        },
        image: {
          type: String,
          required: [true, "product images  is required"],
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      default: "COD",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user id is required"],
    },
    paidAt: Date,
    paymentInfo: {
      id: String,
      status: String,
    },
    itemPrice: {
      type: Number,
      required: [true, "item price is required"],
    },
    tax: {
      type: Number,
      required: [true, "tax price is required"],
    },
    shippingCharges: {
      type: Number,
      required: [true, "item shippingCharges is required"],
    },
    totalAmount: {
      type: Number,
      required: [true, "item totalAmount price is required"],
    },
    orderStatus: {
      type: String,
      enum: ["processing", "shipped", "delivered"],
      default: "processing",
    },
    deliveredAt: Date,
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);

export default Order;

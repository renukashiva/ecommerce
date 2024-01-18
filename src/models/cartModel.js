import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "owner is required"],
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "productId is required"],
        },
        name: String,
        quantity: {
          type: Number,
          required: [true, "product quantity is must"],
          default: 1,
        },
        price: Number,
      },
    ],
    bill: {
      type: Number,
      required: [true, "billing  is must"],
      default: 0,
    },
  },
  { timestamps: true }
);

export const Cart = mongoose.model("Cart", cartSchema);

export default Cart;

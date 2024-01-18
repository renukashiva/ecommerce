import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

export const getCartController = async (req, res) => {
  try {
    //get owner from user object on our request
    const owner = req.user._id;

    //find cart for that user
    const cart = await Cart.findOne({ owner });
    //validation
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "cart not found for a owner",
      });
    }
    res.status(200).json({
      success: true,
      message: "cart for a owner fetched successfully...",
      cart,
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: "error in get cart api",
      error,
    });
  }
};

export const createCartController = async (req, res) => {
  try {
    //get owner from user object on our request
    const owner = req.user._id;

    //get productId and quantity
    const { productId, quantity } = req.body;

    //find cart for that user
    const cart = await Cart.findOne({ owner });
    //find item
    const product = await Product.findById({ _id: productId });
    //validation
    if (!product) {
      return res.status(401).json({
        success: false,
        message: "product not found",
      });
    }

    // if product exsist we get its price and name
    const price = product.price;
    const name = product.name;

    //if cart already exsist fot user
    if (cart) {
      let productIndex = cart.products.findIndex(
        (product) => product.productId == productId
      );

      //check if product exsist or not
      if (productIndex > -1) {
        let product = cart.products[productIndex];

        product.quantity += quantity;

        cart.bill = cart.products.reduce((acc, curr) => {
          return acc + curr.quantity * curr.price;
        }, 0);

        cart.products[productIndex] = product;

        await cart.save();
        res.status(200).json({
          success: true,
          message: "products in cart fetched",
          cart,
        });
      } else {
        cart.products.push({ productId, name, quantity, price });

        cart.bill = cart.products.reduce((acc, curr) => {
          return acc + curr.quantity * curr.price;
        }, 0);
        await cart.save();
        res.status(200).json({
          success: true,
          message: "cart fetched successfully",
          cart,
        });
      }
    } else {
      // no cart exsists,create one
      const newCart = await Cart.create({
        owner,
        products: [{ productId, name, quantity, price }],
        bill: price * quantity,
      });
      return res.status(200).json({
        success: true,
        message: "cart created successfully....",
        newCart,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: "error in create cart api",
      error,
    });
  }
};

export const deleteCartController = async (req, res) => {
  try {
    const owner = req.user._id;
    const productId = req.params.id;

    let cart = await Cart.findOne({ owner });

    // check for product to be deleated by generating index
    const productIndex = cart.products.findIndex(
      (product) => product.productId == productId
    );

    if (productIndex > -1) {
      let product = cart.products[productIndex];

      //reduce the total bill by its total price
      cart.bill -= product.quantity * product.price;

      if (product.bill < 0) cart.bill = 0;

      // remove product from products array in cart
      cart.products.splice(productIndex, 1);

      //recalculate the bill for remaing products
      cart.bill = cart.products.reduce((acc, curr) => {
        return acc + curr.quantity * curr.price;
      }, 0);

      //save it
      cart = await cart.save();

      res.status(200).json({
        success: true,
        message: "cart products deleated and updated successfully",
        cart,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "product to be deleted not found..",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: "error in delete cart api",
      error,
    });
  }
};

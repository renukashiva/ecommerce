import Product from "../models/productModel.js";
import { getDataUri } from "../utils/features.js";
import cloudinary from "cloudinary";

export const getAllProductController = async (req, res) => {
  try {
    const { keyword, category } = req.query;

    const products = await Product.find({
      name: {
        $regex: keyword ? keyword : "",
        $options: "i",
      },
      // category: category ? category : undefined,
    }).populate("category");
    return res.status(200).json({
      success: true,
      message: "all products fetched successfully...",
      totalProducts: products.length,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: "error in get all products api",
      error,
    });
  }
};

export const getTopProductController = async (req, res) => {
  try {
    const product = await Product.find({}).sort({ rating: -1 }).limit(3);
    res.status(200).json({
      success: true,
      message: "top 3 products fetched...",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: "error in get top products api",
      error,
    });
  }
};

export const getSingleProductController = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res(404).json({
        success: false,
        message: "product not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "product found...",
      product,
    });
  } catch (error) {
    console.log(error);
    if (error.name === "castError") {
      return res.status(500).send({
        success: false,
        message: "invalid product id.",
      });
    }
    res.status(401).json({
      success: false,
      message: "error in get single product api",
      error,
    });
  }
};

export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    // if (!name || !description || !price || !stock || !category) {
    //   return res.status(401).json({
    //     success: false,
    //     message: "provide all fields",
    //   });
    // }
    if (!req.file) {
      return res.status(401).json({
        success: false,
        message: "please provide product images",
      });
    }

    const file = getDataUri(req.file);
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    const image = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };
    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      images: [image],
      owner: req.user._id,
    });

    //const products = product.populate(category.category);

    res.status(200).send({
      success: true,
      message: "product created successfully..",
      product,
    });
  } catch (error) {
    console.log(error);

    res.status(401).json({
      success: false,
      message: "error in create product api",
      error,
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res(404).json({
        success: false,
        message: "product not found",
      });
    }

    const { name, description, stock, price, category } = req.body;
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (category) product.category = category;
    if (stock) product.stock = stock;

    await product.save();
    res.status(200).json({
      success: true,
      message: "product updated successfully..",
    });
  } catch (error) {
    if (error.name === "castError") {
      return res.status(500).send({
        success: false,
        message: "invalid product id.",
      });
    }
    res.status(401).json({
      success: false,
      message: "error in update product api",
      error,
    });
  }
};

export const updateProductImageController = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res(404).json({
        success: false,
        message: "product not found",
      });
    }
    if (!req.file) {
      return res(401).json({
        success: false,
        message: "please provide product images",
      });
    }

    const file = getDataUri(req.file);
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    const image = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };
    // adding updated image into images array
    product.images.push(image);
    //save in db
    await product.save();
    res.status(200).json({
      success: true,
      message: "product image updated..",
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "error in update product image api",
      error,
    });
  }
};

export const deleteProductImageController = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res(404).json({
        success: false,
        message: "product not found",
      });
    }
    // find image id from db
    const id = req.query.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "product image id not found",
      });
    }

    let isExsist = -1;
    product.images.forEach((item, index) => {
      if (item._id.toString() === id.toString()) isExsist = index;
    });
    if (isExsist < 0) {
      return res.status(401).json({
        success: false,
        message: "image of product not found",
      });
    }
    //delete product image from cloudinary
    await cloudinary.v2.uploader.destroy(product.images[isExsist].public_id);

    //delete in db also
    product.images.splice(isExsist, 1);

    await product.save();
    res.status(200).json({
      success: true,
      message: "product image deleted successfully...",
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "error in delete product image api",
      error,
    });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res(404).json({
        success: false,
        message: "product not found",
      });
    }

    // find and delete image from cloudinary
    for (let index = 0; index < product.images.length; index++) {
      await cloudinary.v2.uploader.destroy(product.images[index].public_id);
    }

    await product.deleteOne();
    res.status(200).json({
      success: true,
      message: "product deleted successfully..",
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "error in delete product  api",
      error,
    });
  }
};

//create product review and comment
export const productReviewController = async (req, res) => {
  try {
    const { comment, rating } = req.body;
    //find product
    const product = await Product.findById(req.params.id);

    //check user previous comment and review
    const alreadyReview = product.reviews.find((r) => {
      r.user.toString() === req.user._id.toString();
    });

    if (alreadyReview) {
      return res.status(400).json({
        success: false,
        message: "product already reviewed",
      });
    }
    //create new review
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    //inserting above review obj in reviews array
    product.reviews.push(review);

    // num of reviews
    product.numReviews = product.reviews.length;

    // rating
    product.rating =
      product.reviews.reduce((acc, item) => {
        item.rating + acc, 0;
      }) / product.reviews.length;

    await product.save();
    res.status(200).json({
      success: true,
      message: "review successfukky added...",
    });
  } catch (error) {
    console.log(error);
    if (error.name === "castError") {
      return res.status(500).send({
        success: false,
        message: "invalid product id.",
      });
    }
    res.status(401).json({
      success: false,
      message: "error in  product review and comment  api",
      error,
    });
  }
};

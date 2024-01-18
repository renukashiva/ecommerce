import Category from "../models/categoryModel.js";
import router from "../routes/categoryRoutes.js";
import Product from "../models/productModel.js";

export const createCategory = async (req, res) => {
  try {
    const { category } = req.body;
    if (!category) {
      return res.status(401).json({
        success: false,
        message: "please provide category name.",
      });
    }

    await Category.create({ category });
    res.status(200).json({
      success: true,
      message: `${category} category created successfully..`,
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: "error in create category api..",
    });
  }
};

export const getAllCategoryController = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json({
      success: true,
      message: "categories fetched successfully..",
      totalCategory: categories.length,
      categories,
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: "error in get all category api..",
    });
  }
};

export const deleteCategoryController = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(401).json({
        success: false,
        message: "please provide category .",
      });
    }
    //find product with this category id
    const products = await Product.find({ category: category._id });

    //update product category
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      product.category = undefined;
      await product.save();
    }
    await category.deleteOne();
    res.status(200).json({
      success: true,
      message: "category deleted successfully..",
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
      message: "error in delete category api..",
    });
  }
};

export const updateCategoryController = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(401).json({
        success: false,
        message: "please provide category .",
      });
    }
    // get new category from client
    const { updatedCategory } = req.body;

    //find product with this category id
    const products = await Product.find({ category: category._id });

    //update product category
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      product.category = updatedCategory;
      await product.save();
    }
    if (updatedCategory) {
      category.category = updatedCategory;
    }
    await category.save();
    res.status(200).json({
      success: true,
      message: "category updated successfully..",
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
      message: "error in update category api..",
    });
  }
};

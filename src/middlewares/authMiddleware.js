import Jwt from "jsonwebtoken";
import User from "../models/userModel.js";

//user middleware
export const isAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "unauthorized user..",
    });
  }
  const decodedData = Jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decodedData._id);
  next();
};

//admin middleware
export const isAdmin = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(401).json({
      success: false,
      message: "admin only",
    });
  }
  next();
};

import { token } from "morgan";
import User from "../models/userModel.js";
import { getDataUri } from "../utils/features.js";
import cloudinary from "cloudinary";

export const userController = async (req, res) => {
  try {
    const { name, email, password, city, country, phone, address, answer } =
      req.body;

    if (
      (!name || !email || !password || !city || !country || !phone || !address,
      !answer)
    ) {
      return res.status(401).json({
        success: false,
        message: "please provide all fields..",
      });
    }

    const exsistingUser = await User.findOne({ email });

    if (exsistingUser) {
      return res.status(401).json({
        success: false,
        message: "email already registered,try another..",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      city,
      country,
      phone,
      address,
      answer,
    });
    res.status(200).json({
      success: true,
      message: "user registration successfull,please login..",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: "fail",
      message: "error in register api",
      error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        success: false,
        message: "please add email or password",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "user not found",
      });
    }
    // check pass
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(500).json({
        success: false,
        message: "invalid credentials",
      });
    }

    //token
    const token = user.generateToken();

    res
      .status(200)
      .cookie("token", token, {
        secure: true,
      })
      .json({
        success: true,
        message: "login success",
        token,
        user,
      });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "error in login api",
      error,
    });
  }
};

export const getuserProfileController = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json({
      success: true,
      message: "user profile fetched succesfully..",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: "error in profile api..",
    });
  }
};

export const logoutController = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", "", {
        secure: true,
        httpOnly: true,
      })
      .json({
        success: true,
        message: "logout success..",
      });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: "error in logout api..",
    });
  }
};

export const updateProfileController = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { name, email, city, country, address, phone } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (city) user.city = city;
    if (country) user.country = country;
    if (address) user.address = address;
    if (phone) user.phone = phone;

    //save user
    await user.save();
    res.status(200).json({
      success: true,
      message: "user profile updated successfully..",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: "error in update profile api..",
    });
  }
};

export const updatePasswordController = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(401).json({
        success: false,
        message: "please provide old or new password..",
      });
    }

    // check old password
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(500).json({
        success: false,
        message: "invalid old password..",
      });
    }
    //if password is correct ,then store in new password

    user.password = newPassword;
    await user.save();
    res.status(200).json({
      success: true,
      message: "password updated successfully..",
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: "error in update password api..",
    });
  }
};

export const updateProfilePicController = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    //get file(pic) from client(postman)
    const file = getDataUri(req.file);
    // deleate previous pic
    await cloudinary.v2.uploader.destroy(user.profile.public_id);
    //update profilepic
    const cdb = await cloudinary.v2.uploader.upload(file.content);

    user.profile = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: "profile pic updated succesfuly...",
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: "error in update profilePic api.",
      error,
    });
  }
};

export const passwordResetController = async (req, res) => {
  try {
    //getting email,answer,password from user
    const { email, newPassword, answer } = req.body;

    if (!email || !newPassword || !answer) {
      return res.status(401).json({
        success: false,
        message: "please provide all fields",
      });
    }

    //find user and answer
    const user = await User.findOne({ email, answer });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "user or answer not found",
      });
    }

    //update  and save new password
    user.password = newPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message: "user password changed successfully...please login...",
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: "error in password reset api.",
      error,
    });
  }
};

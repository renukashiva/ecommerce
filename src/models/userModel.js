import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      required: [true, "emailis required"],
      unique: [true, "email already exsists"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [6, "password length should be greater than 6 character"],
    },
    address: {
      type: String,
      required: [true, "address is required"],
    },
    city: {
      type: String,
      required: [true, "city name is required"],
    },
    country: {
      type: String,
      required: [true, "country is required"],
    },
    phone: {
      type: String,
      required: [true, "phone no is compulsory"],
    },
    profile: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    answer: {
      type: String,
      required: [true, "answer is required"],
    },
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);

// hashing password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

// compare password
userSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

//jwt token
userSchema.methods.generateToken = function () {
  return Jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const User = mongoose.model("User", userSchema);

export default User;

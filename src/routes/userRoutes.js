import express from "express";
import { rateLimit } from "express-rate-limit";
import {
  getuserProfileController,
  loginController,
  logoutController,
  passwordResetController,
  updatePasswordController,
  updateProfileController,
  updateProfilePicController,
  userController,
} from "../controllers/userController.js";
import { isAuth } from "../middlewares/authMiddleware.js";
import { singleUpload } from "../middlewares/multer.js";

//rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
});

// router obj
const router = express.Router();

//routes
router.post("/register", limiter, userController);

router.post("/login", limiter, loginController);

router.get("/profile", isAuth, getuserProfileController);

router.get("/logout", isAuth, logoutController);

router.put("/profile-update", isAuth, updateProfileController);

router.put("/update-password", isAuth, updatePasswordController);

router.put(
  "/update-profile-pic",
  isAuth,
  singleUpload,
  updateProfilePicController
);

router.post("/reset-password", passwordResetController);
// export
export default router;

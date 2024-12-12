import { Router } from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
  getBlogs,
  addBlogToUser
} from "../controllers/user.controllers.js";
import { refreshaccessToken } from "../controllers/user.controllers.js";
// import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
// import { addBlogToUser } from "../controllers/user.controllers.js";
const router = Router();

router.route("/register").post(
//   upload.fields([
//     {
//       name: "avatar",
//       maxCount: 1,
//     },
//     {
//       name: "coverImage",
//       maxCount: 1,
//     },
//   ]),
  registerUser
);

router.route("/login").post(loginUser);

// Secured Routes
router.route('/add-blog').post(addBlogToUser); 
router.route("/logout").post( verifyJWT,logoutUser);
router.route("/fetch-blog").post(getBlogs);
router.route("/refresh-token").post(refreshaccessToken);

export default router;
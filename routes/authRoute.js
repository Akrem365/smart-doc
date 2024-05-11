import express from "express";
const router = express.Router();
import {
  register,
  login,
  updateUser,
  updateUserApproval,
  getAllUerNotApproved,
  deleteUser,
} from "../controller/authController.js";
import authenticateUser from "../middleware/Auth.js";
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/updateUser").patch(authenticateUser, updateUser);
router.route("/user/:userId/approve").put(authenticateUser, updateUserApproval);
router.route("/notApproved").get(authenticateUser, getAllUerNotApproved);
router.route("/delete/:userID").delete(authenticateUser, deleteUser);
export default router;

import express from "express";
import { deleteUser, getsingleUser, getUserDetails, getUserList, loginUser, logout, registerUser, requestPasswordReset, resetPassword, updatePassword, updateProfile, updateUserRole } from "../controller/userController.js";
import { roleBasedAccess, verifyUserAuth } from "../middleware/userAuth.js";


const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logout);
router.route("/password/forgot").post(requestPasswordReset);
router.route("/password/update").post(verifyUserAuth, updatePassword);
router.route("/reset/:token").post(resetPassword);
router.route("/profile").post(verifyUserAuth, getUserDetails);
router.route("/profile/update").post(verifyUserAuth, updateProfile);
router.route("/admin/users").get(verifyUserAuth, roleBasedAccess("admin"), getUserList);
router.route("/admin/user/:id")
    .get(verifyUserAuth, roleBasedAccess("admin"), getsingleUser)
    .put(verifyUserAuth, roleBasedAccess("admin"), updateUserRole)
    .delete(verifyUserAuth, roleBasedAccess("admin"), deleteUser);

export default router;
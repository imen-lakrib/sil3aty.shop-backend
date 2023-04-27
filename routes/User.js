import express from "express";
import UserController from "../controllers/UserController.js"
import { protectAdmin, protectAllUsers, protectClient, protectAgent } from "../middleware/authMiddleware.js";

const router = express.Router()

router.post('/register', UserController.registerUser)
router.get('/login', UserController.loginUser)
router.get('/logout',protectAllUsers, UserController.LogoutUser)
router.delete('/:id',protectAdmin, UserController.DeleteUser)
router.post('/forgot-password', UserController.ForgotPassword);
router.get('/reset-password/:token', UserController.ResetPassword);
router.post('/reset-password/:token', UserController.SubmitResetPassword);



// change role : just for admin , allow shim to make any user as client or agent
// get single user profile



export default router;

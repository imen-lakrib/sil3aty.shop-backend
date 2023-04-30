import express from "express";
import UserController from "../controllers/UserController.js"
import { protectAdmin, protectAllUsers, protectClient, protectAgent } from "../middleware/authMiddleware.js";






const router = express.Router()

router.post('/register', UserController.registerUser)
router.get('/login', UserController.loginUser)
router.get('/profile/:id', UserController.GetUser)
router.get('/allusers', protectAdmin, UserController.GetAllUsers)
router.get('/logout',protectAllUsers, UserController.LogoutUser)
router.delete('/:id',protectAdmin, UserController.DeleteUser)
router.post('/forgot-password', UserController.ForgotPassword);
router.get('/reset-password/:token', UserController.ResetPassword);
router.post('/reset-password/:token', UserController.SubmitResetPassword);
router.put('/edit',protectClient, UserController.EditMyProfile)
router.put('/adminedit/:id',protectAdmin, UserController.EditProfileByAdmin)
router.put('/changerole/:id', protectAdmin, UserController.ChangeRole)





export default router;

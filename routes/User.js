import express from "express";
import UserController from "../controllers/UserController.js"
import { protectAdmin, protectAllUsers, protectClient, protectAgent } from "../middleware/authMiddleware.js";

const router = express.Router()

router.post('/register', UserController.registerUser)
router.get('/login', UserController.loginUser)
router.get('/logout',protectAllUsers, UserController.LogoutUser)
router.delete('/:id',protectAdmin, UserController.DeleteUser)




export default router;

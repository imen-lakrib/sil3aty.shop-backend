import express from "express";
import SizeController from "../controllers/SizeController.js"
import { protectAdmin, protectAllUsers, protectClient, protectAgent } from "../middleware/authMiddleware.js";

const router = express.Router()



// categories routes
router.get('/', SizeController.GetAllSizes)
router.post('/add',protectAdmin, SizeController.AddProductSize)
router.delete('/delete/:id',protectAdmin, SizeController.DeleteProductSize)





export default router;

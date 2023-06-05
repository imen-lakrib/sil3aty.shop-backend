import express from "express";
import CategoryController from "../controllers/CategoryController.js"
import { protectAdmin, protectAllUsers, protectClient, protectAgent } from "../middleware/authMiddleware.js";

const router = express.Router()



// categories routes
router.get('/', CategoryController.GetAllCategories)
router.post('/add',protectAdmin, CategoryController.AddProductCategory)
router.delete('/delete/:id',protectAdmin, CategoryController.DeleteProductCategory)





export default router;

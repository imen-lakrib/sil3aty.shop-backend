import express from "express";
import ProductController from "../controllers/ProductController.js"
import { protectAdmin, protectAllUsers, protectClient, protectAgent } from "../middleware/authMiddleware.js";

const router = express.Router()



router.get('/allProducts', ProductController.GetProducts)
router.get('/:id', ProductController.GetSingleProduct)
router.post('/new',protectAgent, ProductController.CreateProduct)
router.put('/:id',protectAgent, ProductController.EditProduct)
router.delete('/:id',protectAdmin, ProductController.DeleteProduct)


export default router;

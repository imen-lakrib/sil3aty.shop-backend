import express from "express";
import ProductController from "../controllers/ProductController.js"
import { protectAdmin, protectAllUsers, protectClient, protectAgent } from "../middleware/authMiddleware.js";

const router = express.Router()



router.get('/allProducts', ProductController.GetProducts)
router.get('/:productId', ProductController.GetSingleProduct)
router.post('/new',protectAdmin, ProductController.CreateProduct)

router.put('/:id',protectAgent, ProductController.EditProduct)
router.delete('/:id',protectAdmin, ProductController.DeleteProduct)

// product review routes
router.post('/review/add',protectClient, ProductController.AddReview)
router.get('/review', ProductController.GetSingleProductReview)
router.delete('/review/delete',protectAdmin, ProductController.DeleteUserReview)




export default router;

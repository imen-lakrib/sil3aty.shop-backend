import express from "express";
import ProductController from "../controllers/ProductController.js"
const router = express.Router()


router.get('/allProducts', ProductController.GetProducts)
router.get('/:id', ProductController.GetSingleProduct)
router.post('/new', ProductController.CreateProduct)
router.put('/:id', ProductController.EditProduct)
router.delete('/:id', ProductController.DeleteProduct)


export default router;

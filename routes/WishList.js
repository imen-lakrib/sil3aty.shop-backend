import express from "express";
import CartController from "../controllers/CartController.js";
import { protectAdmin, protectAllUsers, protectClient, protectAgent } from "../middleware/authMiddleware.js";

const router = express.Router()

router.post('/add', protectClient, CartController.AddToWishList)
router.get('/data', protectClient, CartController.GetWishList)
router.delete('/remove/:id', protectClient, CartController.RemoveWishList)
router.post('/addtocart', protectClient, CartController.AddToCart)
router.put('/updatecart/:id', protectClient, CartController.UpdateCart)
router.get('/cart/data', protectClient, CartController.GetCartData)
router.delete('/delete/:id', protectClient, CartController.DeleteCartData)








export default router;

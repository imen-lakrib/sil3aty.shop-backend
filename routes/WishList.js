import express from "express";
import CartController from "../controllers/CartController.js";
import { protectAdmin, protectAllUsers, protectClient, protectAgent} from "../middleware/authMiddleware.js";

const router = express.Router()

router.post('/add', protectClient, CartController.AddToWishList)
router.get('/wishlistdata', protectClient, CartController.GetWishList)

router.post('/addtocart', protectClient, CartController.AddToCart)
router.get('/data', protectClient, CartController.GetCartData)

router.delete('/delete/:id', protectClient, CartController.DeleteCartData)
router.delete('/deleteAll', protectClient, CartController.DeleteAll)

router.put('/updatecart/:id', protectClient, CartController.UpdateCart)
router.delete('/remove/:id', protectClient, CartController.RemoveWishList)










export default router;

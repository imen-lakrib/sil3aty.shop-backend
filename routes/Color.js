import express from "express";
import ColorController from "../controllers/ColorController.js"
import { protectAdmin, protectAllUsers, protectClient, protectAgent } from "../middleware/authMiddleware.js";

const router = express.Router()



// categories routes
router.get('/', ColorController.GetAllColors)
router.post('/add',protectAdmin, ColorController.AddProductColor)
router.delete('/delete/:id',protectAdmin, ColorController.DeleteProductColor)





export default router;

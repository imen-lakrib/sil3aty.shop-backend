import express from "express";
import OrderController from "../controllers/OrderController.js"
import { protectAdmin, protectAllUsers, protectClient, protectAgent } from "../middleware/authMiddleware.js";

const router = express.Router()

router.get('/:id', protectClient, OrderController.GetSingleOrder)
router.post('/mine', protectClient, OrderController.GetAllOfMyOrders)
router.post('/add', protectClient, OrderController.CreateOrder)

router.delete('/delete/:id', protectAdmin, OrderController.DeleteOrder)
router.put('/orderstatus/:id', protectAdmin, OrderController.UpdateOrderStatus)
router.put('/all', protectAdmin, OrderController.AdminGetAllOrders)










export default router;

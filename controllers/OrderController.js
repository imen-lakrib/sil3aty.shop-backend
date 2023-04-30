
import Order from "../models/order";
import Product from "../models/product";



const UpdateStock=async(id, quantity)=>{
    const product = await Product.findById(id);
    if(!product){
        console.log("Product not found")
    }

    product.Stock -= quantity;

    await product.save({ validateBeforeSave: false });

}
const controller = {
    // create order
    CreateOrder: async (req, res) => {
        try {
            const {
                shippingInfo,
                orderItems,
                paymentInfo,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
            } = req.body;

            const newOrder = await Order.create({
                shippingInfo,
                orderItems,
                paymentInfo,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
                paidAt: Date.now(),
                user: req.user._id,
            });
            res.status(201).json({
                success: true,
                newOrder
            });

        } catch (error) {
            res.status(500).json({ message: error });
        }
    },
    GetSingleOrder: async (req, res) => {
        try {
            const order = await Order.findById(req.params.id).populate(
                "user",
                "name email"
            );

            if (!order) {
                return res.status(404).json({ message: "Order not found with this id" })
            }

            res.status(200).json({
                success: true,
                order
            });


        } catch (error) {
            res.status(500).json({ message: error });
        }
    },
    GetAllOfMyOrders: async (req, res) => {
        try {
            const myOrders = await Order.find({ user: req.user._id });
            if (!myOrders) {
                res.status(404).json({ message: 'there is no order yet' })
            }
            res.status(200).json({
                success: true,
                myOrders
            });

        } catch (error) {
            res.status(500).json({ message: error });
        }
    },
    /////////////////////////////// Admin API /////////////////////////////////
    // Get All orders ---Admin
    AdminGetAllOrders: async (req, res) => {
        try {
            const orders = await Order.find();

            let totalAmount = 0;

            orders.forEach((order) => {
                totalAmount += order.totalPrice;
            });

            res.status(200).json({
                success: true,
                totalAmount,
                orders
            });

        } catch (error) {
            res.status(500).json({ message: error });
        }
    },

    // update Order Status ---Admin

    UpdateOrderStatus: async (req, res) => {
        try {
            const order = await Order.findById(req.params.id);

            if (!order) {
                return res.status(404).json({ message: "order not found" });
            }

            if (order.orderStatus === "Delivered") {
                return res.status(404).json({ message: "you have already delivred this order" });
            }

            if (req.body.status === "Shipped") {
                order.orderItems.forEach(async (o) => {
                    await UpdateStock(o.product, o.quantity);
                });
            }
            order.orderStatus = req.body.status;

            if (req.body.status === "Delivered") {
                order.deliveredAt = Date.now();
            }

            await order.save({ validateBeforeSave: false });
            res.status(200).json({
                success: true,
            });

        } catch (error) {
            res.status(500).json({ message: error });
        }
    },
    

    // delete Order ---Admin

    DeleteOrder: async (req, res) => {
        try {
            const order = await Order.findById(req.params.id);

            if (!order) {
                return res.status(404).json({ message: 'order not found' })
            }

            await order.remove();

            res.status(200).json({
                success: true,
            });

        } catch (error) {
            res.status(500).json({ message: error });

        }
    }










}

export default controller;

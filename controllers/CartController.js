import WishList from "../models/wishList.js";
import Cart from "../models/cart.js"
const controller = {
    // Add to wishlist
    AddToWishList: async (req, res) => {
        try {
            const {
                productName,
                quantity,
                productImage,
                productPrice,
                productId,
                Stock,
            } = req.body;
            const wishList = await WishList.create({
                productName,
                quantity,
                productImage,
                productPrice,
                user: req.user._id,
                productId,
                Stock,
            });

            res.status(200).json({
                success: true,
                wishList,
            });

        } catch (error) {
            res.status(500).json({ message: error });
        }
    },
    // get wishlistData Data
    GetWishList: async (req, res) => {
        try {
            const wishlistData = await WishList.find({ user: req.user.id });
            if (!wishlistData) {
                res.status(404).json({ message: "not found" })
            }

            res.status(200).json({
                success: true,
                wishlistData,
            });

        } catch (error) {
            res.status(500).json({ message: error });
        }
    },
    // remove wishlistData
    RemoveWishList: async (req, res) => {
        try {
            const wishlistData = await WishList.findById(req.params.id);

            if (!wishlistData) {
                res.status(404).json({ message: "not found" })

            }
            await wishlistData.deleteOne({ _id: req.params.id });

            res.status(200).json({
                success: true,
                message: "Item removed from wishlist",
            });

        } catch (error) {
            console.log(error)
            res.status(500).json({ message: error });
        }
    },
    // add To Cart
    AddToCart: async (req, res) => {
        try {
          const {
            productName,
            quantity,
            productImage,
            productPrice,
            productId,
            Stock,
          } = req.body;
      
          // Check if the product already exists in the cart
          const existingCartItem = await Cart.findOne({
            productId: productId,
            user: req.user._id,
          });
      
          if (existingCartItem) {
            // If the product exists, increase its quantity by 1
            existingCartItem.quantity += 1;
            await existingCartItem.save();
      
            res.status(200).json({
              success: true,
              cart: existingCartItem,
            });
          } else {
            // If the product does not exist, create a new cart item
            const cart = await Cart.create({

              productName,
              quantity,
              productImage,
              productPrice,
              productId,
              user: req.user._id,
              Stock,
            });
      
            res.status(200).json({
              success: true,
              cart,
            });
          }
        } catch (error) {
          res.status(500).json({ message: error });
        }
      },
    // update Cart
    UpdateCart: async (req, res) => {
        try {
            const { quantity } = req.body;
            const cart = await Cart.findById(req.params.id);

            if (!cart) {
                return res.status(404).json({ message: "No cart found with this id" });
            }

            await Cart.updateOne({ _id: cart._id }, { quantity });

            res.status(200).json({
                success: true,
                message: "Cart item updated",
            });

        } catch (error) {
            console.log(error)
            res.status(500).json({ message: error });
        }
    },
    // get Cart Data
    GetCartData: async (req, res) => {
        try {
            const cartData = await Cart.find({ user: req.user.id });
            res.status(200).json({
                data:cartData
            });

        } catch (error) {
            res.status(500).json({ message: error });
        }
    },
    // remove Cart Data
    DeleteCartData: async (req, res) => {
        try {
            const cartData = await Cart.findById(req.params.id);

            if (!cartData) {
                return res.status(400).json({ message: "Items is not found with this id" })
            }

            await Cart.deleteOne({ _id: req.params.id, user: req.user._id })

            res.status(200).json({
                success: true,
                message: "Item removed from cart",
            });

        } catch (error) {
            console.log(error)
            res.status(500).json({ message: error });
        }
    },












}

export default controller;

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
                userId,
                productId,
                Stock,
            } = req.body;
            const wishList = await WishList.create({
                productName,
                quantity,
                productImage,
                productPrice,
                userId,
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
            const wishlistData = await WishList.find({ userId: req.user.id });
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

            await wishlistData.remove();

            res.status(200).json({
                success: true,
                message: "Item removed from wishlist",
            });

        } catch (error) {
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
                userId,
                productId,
                Stock,
            } = req.body;
            const cart = await Cart.create({
                productName,
                quantity,
                productImage,
                productPrice,
                userId,
                productId,
                Stock,
            });

            res.status(200).json({
                success: true,
                cart,
            });

        } catch (error) {
            res.status(500).json({ message: error });
        }
    },
    // update Cart
    UpdateCart: async (req, res) => {
        try {
            const {
                quantity,
            } = req.body;
            const cart = await Cart.findByIdAndUpdate(req.params.id);

            if (!cart) {
                return res.status(404).json({ message: "No cart found with this id" })
            }

            await cart.update({
                quantity,
            });

        } catch (error) {
            res.status(500).json({ message: error });
        }
    },
    // get Cart Data
    GetCartData: async (req, res) => {
        try {
            const cartData = await Cart.find({ userId: req.user.id });
            res.status(200).json({
                success: true,
                cartData,
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
    return res.status(400).json({message:"Items is not found with this id"})
  }

  await cartData.remove();

  res.status(200).json({
    success: true,
    message: "Item removed from cart",
  });

        } catch (error) {
            res.status(500).json({ message: error });
        }
    },












}

export default controller;

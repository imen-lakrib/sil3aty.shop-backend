import mongoose from "mongoose";
const WishListSchema = mongoose.Schema({
    productName: {
        type: String,
        required: [true, "Please enter your product name"],
      },
      productPrice: {
        type: Number,
        required: [true, "Please enter your product price"],
      },
      productImage: {
        type: String,
        required: [true, "Please enter your product image"],
      },
      quantity: {
        type: Number,
        required: [true, "Please enter your product quantity"],
      },
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      productId:{
        type: String,
        required: [true, "Please enter your user id"],
      },
     
    
}) 

const WishList = mongoose.model('WishList', WishListSchema);

export default WishList;

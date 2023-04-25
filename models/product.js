import mongoose from "mongoose";

const ProductSchema = mongoose.Schema({
    name:{
        type: String,
        require: [true, "make sure to add a name to your product"],
        // trim : emove whitespace from the beginning and end of a string before it is saved to the database
        trim: true,
        maxLength: [15, "make your product title shorter"]

    },
    description:{
        type: String,
        require: [true, "make sure to add a description to your product"],
        maxLength: [4000, "your product description is too long"]
    },
    price:{
        type: Number,
        require: [true, "Please specify a price"],
        maxLength: [8, "this is so expensive"]
    },
    discountPrice:{
        type: Number,
        maxLength: [4, "discount price can not exceed than 4 characters "],
        validate: {
            validator: function(value) {
                return value < this.price;
            },
            message: "Discount price cannot be greater than the product price"
        }
    },
    color:{
        type: String
    },
    size:{
        type: String
    },
    ratings:{
        type: Number,
        default: 0
    },
    images: [
        {public_id: {
            type: String,
            require: true
        },
        url: {
            type: String,
            require: true
        },
    }
    ],
    category:{
        type: String,
        require: [true, "please select a category"]
    },
    stock:{
        type: Number,
        require: [true, "please add some stock for your product"],
        maxLength: [3, "Stock  can not exceed than 3 characters "],
    },
    numberOfReviews: {
        type: Number,
        default:0
    },
    reviews:[
        {
            user: {
                type:mongoose.Schema.ObjectId,
                ref: "User",
                require: true
            },
            name:{
                type: String,
                require: true
            },
            rating:{
                type: Number,
                require: true
            },
            comment: {
                type: String,
            },
            time:{
                type: Date,
                default: Date.now()
            }
        }
    ],
    user: {
        type:mongoose.Schema.ObjectId,
        ref: "User",
        require: true

    },
    createdAt:{
        type: Date,
        default: Date.now()
    },

}) 

const Product = mongoose.model('Product', ProductSchema);

export default Product;

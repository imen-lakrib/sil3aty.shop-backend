
import Product from "../models/product.js";
import Features from "../utils/Features.js";

const controller = {


    // Delete Client Review --Admin -- Agent id
    DeleteUserReview: async (req, res) => {
        try {
            const product = await Product.findById(req.query.productId);
            if (!product) {
                res.status(404).json({ message: 'Product not found' })
            }
            const reviews = product.reviews.filter(
                (rev) => rev._id.toString() !== req.query.id.toString()
            );

            let avg = 0;

            reviews.forEach((rev) => {
                avg += rev.rating;
            });

            let ratings = 0;

            if (reviews.length === 0) {
                ratings = 0;
            } else {
                ratings = avg / reviews.length;
            }

            const numOfReviews = reviews.length;

            await Product.findByIdAndUpdate(
                req.query.productId,
                {
                    reviews,
                    ratings,
                    numOfReviews,
                },
                {
                    new: true,
                    runValidators: true,
                    useFindAndModify: false,
                }
            );

            res.status(200).json({
                success: true,
            });


        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server Error");

        }
    },

    


    // Get Single Product Review :id
    GetSingleProductReview: async (req, res) => {
        try {
            const product = await Product.findById(req.query.id);
            // check if thr product exist 
            if (!product) {
                res.status(404).json({ message: "this product is not exist" })
            }
            res.status(200).json({
                success: true,
                reviews: product.reviews,
            })


        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server Error");
        }
    },




    // Add A Review -- Client  -- userId productId
    // each user can add only one review for a product that is already purchased
    // if he tryed to add another review the second one will overide the existing
    AddReview: async (req, res) => {
        try {
            const { rating, comment, productId } = req.query

            const review = {
                user: req.user._id,
                name: req.user.name,
                rating: Number(rating),
                comment
            }
            // get the product :
            const product = await Product.findById(productId)
            if (!product) {
                res.status(400).send("this product is not available");
            }
            // only one review: 
            const existingReview = product.reviews.find((review) => review.user.toString() === req.user._id.toString());
            if (existingReview) {
                existingReview.rating = rating;
                existingReview.comment = comment;
            } else {
                product.reviews.push(review);
            }

            product.numOfReviews = product.reviews.length;

            //

            let avg = 0;

            product.reviews.forEach((rev) => {
                avg += rev.rating;
            });

            product.ratings = avg / product.reviews.length;

            await product.save({ validateBeforeSave: false });

            res.status(200).json({
                success: true,
            });
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server Error");
        }
    },










}

export default controller;

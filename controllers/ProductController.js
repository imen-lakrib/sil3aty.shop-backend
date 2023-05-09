
import Product from "../models/product.js";
import Features from "../utils/Features.js";

const controller = {
    GetProducts: async (req, res) => {
        const features = Features(Product, req.query);
        try {
            const searchResults = await features.search();
            const filteredResults = await features.filter();
            const paginatedResults = await features.paginate(filteredResults.filter((product) => searchResults.map((product) => product._id.toString()).includes(product._id.toString())));
          
            if (paginatedResults.results.length === 0) {
              return res.status(404).json({ message: "No products found" });
            }
          
            res.status(200).json({
              products: paginatedResults.results,
              pagination: paginatedResults.pagination,
            });
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    },



    CreateProduct: async (req, res) => {
        try {
          console.log('Request body:', req.body);
      
          if (!req.body.name || !req.body.description || !req.body.price) {
            console.log('Required fields are missing');
            return res.status(422).json({ message: "Please provide all required fields." });
          }
      
          const newProduct = await Product.create(req.body);
          console.log('New product:', newProduct);
      
          res.status(200).json({ newProduct });
        } catch (error) {
          console.log('Error:', error);
          res.sendStatus(500);
        }
      },
    EditProduct: async (req, res) => {
        try {
            let currentProduct = await Product.findById(req.params.id)
            if (!currentProduct) {
                return res.status(404).json({ message: "this product is not found" })
            }
            currentProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidation: true,
                useUnified: false
            }
            )
            res.status(200).json({ currentProduct })
        } catch (error) {
            console.log(error)
            res.sendStatus(500)
        }
    },
    DeleteProduct: async (req, res) => {
        try {
            const currentProduct = await Product.findById(req.params.id);
            if (!currentProduct) {
                return res.status(404).json({ message: "This product is not found" });
            }
            await Product.deleteOne({ _id: req.params.id });
            //   await currentProduct.remove();
            res.status(200).json({ message: "This product has been removed" });
        } catch (error) {
            console.log(error);
            if (error.kind === "ObjectId") {
                return res.status(404).json({ message: "Invalid product ID" });
            }
            res.status(500).json({ message: "Server error" });
        }
    },


    GetSingleProduct: async (req, res) => {
        try {
            const currentProduct = await Product.findById(req.query.productId);
            
            if (!currentProduct) {
                return res.status(404).json({ message: "This product is not found" });
            }
            res.status(200).json({ currentProduct });


        } catch (error) {
            console.log(error)
            res.sendStatus(500)

        }
    },


    // product review :
     // Delete Client Review --Admin -- Agent id
     DeleteUserReview: async (req, res) => {
        try {
            const product = await Product.findById(req.query.productId);
            if (!product) {
                res.status(404).json({ message: 'Product not found' })
            }
            const reviews = product.reviews.filter(
                (rev) => !rev._id.equals(req.query.id) //rev._id.toString() !== req.query.id.toString()
            );
            console.log("review filter", reviews)

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

            const numberOfReviews = reviews.length;

            await Product.findByIdAndUpdate(
                req.query.productId,
                {
                    reviews,
                    ratings,
                    numberOfReviews,
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
            const { productId } = req.query

            const product = await Product.findById(productId)

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
            res.status(500).send(error.message);
        }
    },




    // Add A Review -- Client  -- userId productId
    // each user can add only one review for a product that is already purchased
    // if he tryed to add another review the second one will overide the existing
    AddReview: async (req, res) => {
        try {
            const { rating, comment, productId } = req.query

            console.log(req.user)

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

            product.numberOfReviews = product.reviews.length;

            //

            let avg = 0;

            product.reviews.forEach((rev) => {
                avg += rev.rating;
            });

            product.ratings = avg / product.reviews.length;

            await product.save({ validateBeforeSave: false });

            res.status(200).json({
                success: true,
                product

            });
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server Error");
        }
    },






}

export default controller;


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
            if (!req.body.name || !req.body.description || !req.body.price) {
                return res.status(422).json({ message: "Please provide all required fields." });
            }
            const newProduct = await Product.create(req.body)
            res.status(200).json({ newProduct })

        } catch (error) {
            console.log(error)
            res.sendStatus(500)
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
            let currentProduct = await Product.findById(req.params.id);
            if (!currentProduct) {
                return res.status(404).json({ message: "This product is not found" });
            }
            res.status(200).json({ currentProduct });


        } catch (error) {
            console.log(error)
            res.sendStatus(500)

        }
    }

}

export default controller;

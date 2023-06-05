
import Category from "../models/category.js";
const controller = {
 
    AddProductCategory: async (req, res) => {
        try {
            if (!req.body.categoryName) {
                return res.status(422).json({ message: "Please provide all required fields." });
            }
            const newCategory = await Category.create(req.body)
            res.status(200).json({ newCategory });


        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server Error");
        }
    },
    DeleteProductCategory: async (req, res) => {
        try {
            const currentCategory = await Category.findById(req.params.id)
            if (!currentCategory) {
                return res.status(422).json({ message: "category not found" });
            }
            await Category.deleteOne({ _id: req.params.id });
            res.status(200).json({ message: "This categort has been removed" });


        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server Error");
        }
    },
    GetAllCategories: async (req, res) => {
        try {
          const categories = await Category.find();
          if (!categories) {
            return res.status(404).json({ message: 'No categories found' });
          }
          res.status(200).json(categories);
        } catch (error) {
          console.error("Error retrieving categories:", error);
          res.status(500).send("Server Error");
        }
      }






}

export default controller;

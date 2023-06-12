
import Size from "../models/size.js";
const controller = {
 
    AddProductSize: async (req, res) => {
        try {
            if (!req.body.sizeName) {
                return res.status(422).json({ message: "Please provide all required fields." });
            }
            const newSize = await Size.create(req.body)
            res.status(200).json({ newSize});


        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server Error");
        }
    },
    DeleteProductSize: async (req, res) => {
        try {
            const currentSize = await Size.findById(req.params.id)
            if (!currentSize) {
                return res.status(422).json({ message: "Size not found" });
            }
            await Size.deleteOne({ _id: req.params.id });
            res.status(200).json({ message: "This Size has been removed" });


        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server Error");
        }
    },
    GetAllSizes: async (req, res) => {
        try {
          const sizes = await Size.find();
          if (!sizes) {
            return res.status(404).json({ message: 'No sizes found' });
          }
          res.status(200).json(sizes);
        } catch (error) {
          console.error("Error retrieving sizes:", error);
          res.status(500).send("Server Error");
        }
      }






}

export default controller;

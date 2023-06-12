
import Color from "../models/color.js";
const controller = {
 
    AddProductColor: async (req, res) => {
        try {
            if (!req.body.colorName) {
                return res.status(422).json({ message: "Please provide all required fields." });
            }
            const newColor = await Color.create(req.body)
            res.status(200).json({ newColor});


        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server Error");
        }
    },
    DeleteProductColor: async (req, res) => {
        try {
            const currentColor = await Color.findById(req.params.id)
            if (!currentColor) {
                return res.status(422).json({ message: "color not found" });
            }
            await Color.deleteOne({ _id: req.params.id });
            res.status(200).json({ message: "This color has been removed" });


        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server Error");
        }
    },
    GetAllColors: async (req, res) => {
        try {
          const colors = await Color.find();
          if (!colors) {
            return res.status(404).json({ message: 'No colors found' });
          }
          res.status(200).json(colors);
        } catch (error) {
          console.error("Error retrieving colors:", error);
          res.status(500).send("Server Error");
        }
      }






}

export default controller;

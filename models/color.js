import mongoose from "mongoose";

const ColorSchema = mongoose.Schema({
   
      colorName: {
        type: String,
        required: [true, "Please enter your color"],
      },
    
     
}) 

const Color = mongoose.model('Color', ColorSchema);

export default Color;

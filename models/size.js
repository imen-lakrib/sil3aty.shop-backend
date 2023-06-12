import mongoose from "mongoose";

const SizeSchema = mongoose.Schema({
   
      sizeName: {
        type: String,
        required: [true, "Please enter your size"],
      },
    
     
}) 

const Size = mongoose.model('Size', SizeSchema);

export default Size;

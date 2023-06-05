import mongoose from "mongoose";

const CategorySchema = mongoose.Schema({
   
      categoryName: {
        type: String,
        required: [true, "Please enter your Category"],
      },
    
     
}) 

const Category = mongoose.model('Category', CategorySchema);

export default Category;

import mongoose from 'mongoose';
const connectDb=async()=>{
    try {
        const connect= await mongoose.connect(process.env.MONGO_URI)
        console.log("mongodb connected successfully"+ connect)
        
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

export default connectDb
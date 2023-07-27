import  express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv"
import connectDb from "./config/db.js"



// import routes:
import ProductRoute from './routes/Product.js'
import UserRoute from './routes/User.js'
import OrderRoute from './routes/Order.js'
import WishList from './routes/WishList.js'
import CategoryRoute from './routes/Category.js'
import ColorRoute from './routes/Color.js'
import SizeRoute from './routes/Size.js'

dotenv.config();
connectDb()



const PORT = process.env.PORT || 5000 

const app = express();



// read the body 
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use(cors());
// Get the directory name using import.meta.url
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Use the directory name to set up the static files middleware
app.use(express.static(path.join(__dirname, "public"), { dotfiles: "allow" }));




// create routes:
app.use('/products',ProductRoute)
app.use('/user',UserRoute)
app.use('/order',OrderRoute)
app.use('/cart',WishList)
app.use('/categories',CategoryRoute)
app.use('/colors',ColorRoute)
app.use('/sizes',SizeRoute)



app.use("/test",(req,res)=>{
  res.send("hello world")
})


app.listen(PORT, ()=> console.log(`listening on port : ${PORT}`));
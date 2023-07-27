import  express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import nodemailer from "nodemailer";



// import routes:
import ProductRoute from './routes/Product.js'
import UserRoute from './routes/User.js'
import OrderRoute from './routes/Order.js'
import WishList from './routes/WishList.js'
import CategoryRoute from './routes/Category.js'
import ColorRoute from './routes/Color.js'
import SizeRoute from './routes/Size.js'
import SendEmail from "./utils/SendEmail.js";

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


app.post("/send-email", async (req, res) => {
  try {
    const { fullname, email, message } = req.body;

    // Create the mail options
    const mailOptions = {
      to: "your-personal-email@example.com", // Your personal email
      subject: "New Contact Form Submission",
      text: `Full Name: ${fullname}\nEmail: ${email}\nMessage: ${message}`,
    };

     // Send email using the SendEmail function
     const result = await SendEmail(mailOptions);

     console.log("Email sent successfully!", result);
 
     res.status(200).json({ message: "Email sent successfully!" });
   } catch (error) {
     console.error("Error sending email:", error.message); // Log the error message
     res.status(500).json({ error: "An error occurred while sending the email" });
   }
});




app.listen(PORT, ()=> console.log(`listening on port : ${PORT}`));
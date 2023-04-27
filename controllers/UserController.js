import User from '../models/user.js';
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken';
// Generate JWT
const generateJwt = (id) => {
    return jwt.sign({ id }, "Bearer", { expiresIn: "30d" })
}




var controller = {
    registerUser: async (req, res) => {
        try {
            const { email, password, username, role } = req.body
            if (!email || !password || !username) {
                return res.status(400).json({ message: 'please add all fields' })
            }
            // check if user exists : 
            const userExists = await User.findOne({ email })
            if (userExists) {
                return res.status(400).json({ message: 'user already exists' })
            }
            // Hash password : 
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)

            // create user : 
            const user = await User.create({
                email,
                password: hashedPassword,
                username,
                avatar: {
                    public_id: "http://www.example.com",
                    url: "http://www.example.com"
                },
                role
            })
            res.status(201).json({ message: `you are created a new user: ${user}` })

        } catch (error) {
            console.log(error)
            res.sendStatus(500)

        }

    },
    loginUser: async (req, res) => {
        try {
            const { email, password } = req.body
            // check for user email : 
            const user = await User.findOne({ email }).select("+password +role +_id +email");

            if (!user) {
                console.log('User not found')
                res.status(400).json({ message: "invalid user" })
            }
            console.log('User', user, user.email, user._id)
            // compare the password:
            const isCorrect = await bcrypt.compare(password, user.password)
            // check the password : 
            if (!isCorrect) {
                console.log('Invalid password')
                res.status(400).json({ message: "invalid password" })
            }
            console.log('User logged in', user, user.email, user._id)
            res.status(200).json({
                email:user.email,
                token: generateJwt({
                    role: user.role,
                    id: user._id,
                })
            })
            console.log('User logged in', user, user.email, user._id)

        }
        catch (err) {
            console.log(err)
            res.sendStatus(500)
        }
    },
    LogoutUser: (req, res) => {
        try {
            // Clear the cookie
            res.clearCookie('authToken');
            // Send a success response
            res.status(200).json({ message: 'User logged out successfully.' });
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    },
    DeleteUser: async (req, res) => {
        try {
            const currentUser = await User.findById(req.params.id);
            if (!currentUser) {
                console.log('User not found')
                return res.status(404).json({ message: "This user is not found" });
            }
            console.log('User found', req.params.id, currentUser._id)          
            await User.deleteOne({ _id: req.params.id });
            console.log('User deleted')
            res.status(200).json({ message: "This user has been removed" });
            
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }


}


export default controller
import User from '../models/user.js';
import bcrypt from "bcrypt"
import crypto from "crypto"
import jwt from 'jsonwebtoken';
import SendEmail from '../utils/SendEmail.js';
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
                return res.status(400).json({ message: "invalid user" })
            }
            
            console.log('User', user, user.email, user._id)
            
            const isCorrect = await bcrypt.compare(password, user.password)
            
            if (!isCorrect) {
                console.log('Invalid password')
                return res.status(400).json({ message: "invalid password" })
            }
            
            console.log('User logged in', user, user.email, user._id)
            
            res.status(200).json({
                email: user.email,
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
    },
    ForgotPassword: async (req, res) => {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email });
        
            if (!user) {
              return res.status(404).json({ message: 'User not found' });
            }
        
            // Generate a new password reset token and update the user's record
            const resetToken = crypto.randomBytes(20).toString('hex');
            user.passwordResetToken = resetToken;
            user.passwordResetExpires = Date.now() + 3600000; // 1 hour
            await user.save();
        
            // Send the password reset email with the new token
            const resetUrl = `http://${req.headers.host}/reset-password/${resetToken}`;
            const message = `Hi ${user.username},\n\nWe received a request to reset your password. Please click the link below to create a new password:\n\n${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you did not request a password reset, please ignore this email.\n\nBest regards,\nYour App Name`;
            await SendEmail({ to: user.email, subject: 'Password Reset', text: message });
        
            res.status(200).json({ message: 'Password reset email sent.' });


        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    },
// new page on your website where they can enter a new password.
// This page should validate the token in the URL and confirm that it is still valid (i.e., it hasn't expired).
    ResetPassword: async(req,res)=>{
        try {
            const { token } = req.params;
            console.log(token)
            const user = await User.findOne({ passwordResetToken: token, passwordResetExpires: { $gt: Date.now() } });

            console.log(user)
            if (!user) {
              return res.status(400).json({ message: 'Invalid or expired token' });
            }
        
            // Render the password reset form
            res.render('reset-password', { token });
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
            
        }
    },
    SubmitResetPassword:async(req,res)=>{
        try {
            const { token } = req.params;
            const { password } = req.body;
            const user = await User.findOne({ passwordResetToken: token, passwordResetExpires: { $gt: Date.now() } });
        
            if (!user) {
              return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
            }
        
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
        
            user.password = hashedPassword;
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save();
        
            res.status(200).json({ message: 'Your password has been reset successfully.' });
        
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
            
        }

    }


}


export default controller
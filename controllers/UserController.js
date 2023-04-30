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

            // Validate request parameters
            if (!email || !password || !username) {
                return res.status(400).json({ message: 'Please provide all required fields.' });
            }

            // Check if user already exists
            const user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ message: 'User already exists with this email.' });
            }

            // Hash password and create user
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = new User({
                email,
                password: hashedPassword,
                username,
                avatar: {
                    public_id: "http://www.example.com",
                    url: "http://www.example.com"
                },
                role
            });
            await newUser.save();

            res.status(201).json({ message: `You have successfully created a new user with email: ${newUser.email}` });

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
    GetUser: async (req, res) => {
        try {
            const { id } = req.params;
            const user = await User.findById(id);

            if (!user) {
                return res.status(404).json({ message: `User with ID ${id} not found` });
            }

            res.status(200).json(user);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error });
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
    ResetPassword: async (req, res) => {
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
    SubmitResetPassword: async (req, res) => {
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

    },
    GetAllUsers: async (req, res) => {
        try {
            const users = await User.find()
            if (!users) {
                res.status(400).json({ message: 'No users found' })
            }
            res.status(200).json(users)
        } catch (error) {
            console.log(error)
            res.sendStatus(500)

        }
    },
    EditProfileByAdmin: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            user.username = req.body.username || user.username;
            user.email = req.body.email || user.email;

            const updatedUser = await user.save();

            res.status(200).json(updatedUser);
        } catch (error) {
            console.error(error.message);
            res.status(500).send(error.message);
        }
    },
    EditMyProfile: async (req, res) => {

        try {
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            user.username = req.body.username || user.username;
            user.email = req.body.email || user.email;

            const updatedUser = await user.save();

            res.status(200).json(updatedUser);
        } catch (error) {
            console.error(error.message);
            res.status(500).send(error.message);
        }
    },
    ChangeRole:async(req,res)=>{
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            user.role = req.body.role || user.role;

            const updatedUser = await user.save();

            res.status(200).json(updatedUser);
            
        } catch (error) {
            console.error(error.message);
            res.status(500).send(error.message);
            
        }
    }

}






export default controller
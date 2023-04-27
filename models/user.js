import mongoose from "mongoose";

import validator from "validator";



const UserSchema = mongoose.Schema({

    username: {
        type: String,
        required: [true, "Please enter a name of yourself"],
        minLength: [3, "Please enter a name atleast 3 characters"],
        maxlength: [15, "Name can not big than 10 characters"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        validate: [validator.isEmail, "Please enter a valid email"],
        unique: true,
    },
    role: {
        type: String,
        default: "Client"
    },
    password: {
        type: String,
        required: [true, "Please enter your password!"],
        minlength: [8, "Password should be greater than 8 characters"],
        select: false,
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },

    passwordResetToken: { type: String, default: null },
    passwordResetExpires: { type: Date, default: null }
    
})

const User = mongoose.model('User', UserSchema);

export default User;

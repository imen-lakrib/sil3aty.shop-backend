import jwt from 'jsonwebtoken'
import User from '../models/user.js'
// only admin users
const protectAdmin = async(req, res, next) =>{
    let token 
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            // Get Token From Header:
            token = req.headers.authorization.split(' ')[1]
            if(!token){
                console.log('No token found')
                res.status(403).json({message: "we cant get token"})
            }
            // Verify The Token :
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            if(!decoded){
                console.log('Token could not be decoded')
                res.status(403).json({message: "we cant decoded"})
            }
            // Get User From The Token :
            // const validDecodedId = new mongoose.Types.ObjectId(decoded.id);

            req.user = await User.findById(decoded.id.id).select('-password')
            if(!req.user){
                console.log('User not found')
                res.status(404).json({message: "User not found"})
            }
            if(decoded.id.role === 'Admin'){
                console.log('Admin authorized')
                next()
            } else {
                console.log('User not authorized')
                res.status(401).json({message: 'User not authorized'})
            }
        }
        catch(err){
            console.log(err)
            res.status(401).json({message: 'not authorized'})
        }
    }
    if (!token){
        console.log('No token found')
        return res.status(401).json({ message: 'not authorized, no token' });
    }
}


// only customers
const protectClient = async(req, res, next) =>{
    let token 
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            // Get Token From Header:
            token = req.headers.authorization.split(' ')[1]
            if(!token){
                console.log('No token found')
                res.status(403).json({message: "we cant get token"})
            }
            // Verify The Token :
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            if(!decoded){
                console.log('Token could not be decoded')
                res.status(403).json({message: "we cant decoded"})
            }
            // Get User From The Token :
            // const validDecodedId = new mongoose.Types.ObjectId(decoded.id);

            req.user = await User.findById(decoded.id.id).select('-password')
            if(!req.user){
                console.log('User not found')
                res.status(404).json({message: "User not found"})
            }
            if(decoded.id.role === 'Client'){
                console.log('Client authorized')
                next()
            } else {
                console.log('User not authorized')
                res.status(401).json({message: 'User not authorized'})
            }
        }
        catch(err){
            console.log(err)
            res.status(401).json({message: 'not authorized'})
        }
    }
    if (!token){
        console.log('No token found')
        return res.status(401).json({ message: 'not authorized, no token' });
    }
}





// only agent

const protectAgent = async (req, res, next) => {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get Token From Header:
            token = req.headers.authorization.split(' ')[1]
            // Verify The Token :
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            // Get User From The Token :
            req.user = await User.findById(decoded.id.id).select('-password')
            if (decoded.id.role === 'Agent' || decoded.id.role === 'Admin')
                next()



        }
        catch (err) {
            console.log(err)
            res.status(401).json({ message: 'not authorized' })

        }
    }
    if (!token) {
        return res.status(401).json({ message: 'not authorized, no token' });

    }

}


// all users 
const protectAllUsers = async (req, res, next) => {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get Token From Header:
            token = req.headers.authorization.split(' ')[1]
            // Verify The Token :
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            // Get User From The Token :
            req.user = await User.findById(decoded.id.id).select('-password')
            if (decoded.id.role === 'Agent' || decoded.id.role === 'Admin' || decoded.id.role === 'Client')
                next()



        }
        catch (err) {
            console.log(err)
            res.status(401).json({ message: 'not authorized' })

        }
    }
    if (!token) {
        return res.status(401).json({ message: 'not authorized, no token' });

    }

}

export { protectAdmin, protectClient, protectAgent, protectAllUsers }
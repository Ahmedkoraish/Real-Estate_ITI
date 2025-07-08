import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';

const generateToken = (id,userName)=>{
    return jwt.sign(
        {id,userName},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    );
}

const isCorrectPassword =async (currentPassword,userPassword)=>{
    return await bcrypt.compare(currentPassword,userPassword)
}

export const signUp = async (req,res)=>{
    try {
        const {
            userName,
            email,
            password,
            gender,
            role,
            dateOfBirth,
            phoneNumber
        }= req.body;

        if(!userName || !email || !password || !gender || !phoneNumber){
            return res.status(400).json({
                Status:"Failed",
                Message:"please provide all required fileds"
            })
        }
        const user = await userModel.create({
            userName,
            email,
            password,
            gender,
            role,
            dateOfBirth,
            phoneNumber
        });

        const token = generateToken(user._id,user.userName);

        return res.status(201).json({
            Status:"Success",
            Message:"User Created Successfuly",
            Data: user,
            Token : token
        })
    } catch (error) {
        return res.status(500).json({
            Status:"Failed",
            Messsage:"Internal Server Error",
            Error: error.message
        })
    }
}

export const login = async (req,res)=>{
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                Status:"Faild",
                Message:"please provide email and password"
            });
        }
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(404).json({
                Status:"failed",
                Message:"User Must Register First"
            });
        }

        const ispasswordMatch = isCorrectPassword(password,user.password);

        if(!ispasswordMatch){
            return res.status(401).json({
                Status:"Failed",
                Message:"Invalid Eamil Or Password"
            });
        }
        const token = generateToken(user._id,user.userName);

        return res.status(200).json({
            Status:"Success",
            Message:"User Logged In Successfully",
            Token:token
        })
    } catch (error) {
        return res.status(500).json({
            Status:"failed",
            Message:"internal Server Error",
            Error: error.message
        })
    }
} 

export const isUserLoggedIn = async (req,res,next)=>{
    try {
        let token="";
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];
        }
        if(!token){
            return res.status(401).json({
                Status:"Failed",
                Message:"you are not authorized to access this route,please login first"
            })
        }

        const payLoad = jwt.verify(token,process.env.JWT_SECRET);

        const user = await userModel.findById(payLoad.id);

        if(!user){
            return es.status(404).json({
                Status:"Failed",
                Message:"User Not Found"
            })
        }

        req.user = user;
        next();

    } catch (error) {
        return res.status(500).json({
            Status:"Failed",
            Message:"internal Server Error",
            Error: error.message
        })
    }
}

export const userPermission = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user?.role)){
            return res.status(403).json({
                Status:"Failed",
                Message:"You do not have permission to access this route"
            });
        }
        next();
    }
}
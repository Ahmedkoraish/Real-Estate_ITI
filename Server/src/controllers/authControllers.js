import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken'

const generateToken = (id,userName)=>{
    return jwt.sign(
        {id,userName},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    );
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

        if(!userName || !email || !password || !gender || phoneNumber){
            return res.status(400).json({
                status:"failed",
                message:"please provide all required fileds"
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
            status:"Success",
            message:"User Created Successfuly",
            data: user,
            token : token
        })
    } catch (error) {
        return res.status(500).json({
            status:"failed",
            message:"Internal Server Error",
            error: error.message
        })
    }
}

export const login = async (req,res)=>{
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                status:"failed",
                message:"please provide email and password"
            });
        }
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(404).json({
                status:"failed",
                message:"User Must Register First"
            });
        }

        const ispasswordMatch = await user?.isCorrectPassword(password,user.password);

        if(!ispasswordMatch){
            return res.status(401).json({
                status:"failed",
                message:"Invalid Eamil Or Password"
            });
        }
        const token = generateToken(user._id,user.userName);

        return res.status(200).json({
            status:"Success",
            message:"User Logged In Successfully",
            token:token
        })
    } catch (error) {
        return res.status(500).json({
            status:"failed",
            message:"internal Server Error",
            error: error.message
        })
    }
} 

export const isUserLoggedIn = async (req,res,next)=>{
    try {
        let token="";
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.spalit(' ')[1];
        }

        if(!token){
            return res.status(401).json({
                status:"failed",
                message:"you are not authorized to access this route,please login first"
            })
        }

        const payLoad = jwt.verify(token,process.env.JWT_SECRET);
        
        const user = await userModel.findById(payLoad.id);

        if(!user){
            return es.status(404).json({
                status:"faild",
                message:"User Not Found"
            })
        }

        req.user = user;
        next();

    } catch (error) {
        return res.status(500).json({
            status:"failed",
            message:"internal Server Error",
            error: error.message
        })
    }
}

export const userPermission = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                status:"faild",
                message:"you arn not have Permission to access this route"
            });
        }
        next();
    }
}
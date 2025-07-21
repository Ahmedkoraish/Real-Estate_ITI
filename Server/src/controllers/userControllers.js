import userModel from "../models/userModel.js"
import bcrypt from 'bcryptjs'
import { sendOTPEmail } from "../utilities/sendEmail.utilies.js";
export const getAllUsers = async (req,res)=>{  
    try {
        const users = await userModel.find({},{password:0,phoneNumber:0,role:0,__v:0});

        if(users.length===0){
            return res.status(404).json({
                status:"Failed",
                message:"No Users Found",
                data:users
            })
        }
        res.status(201).json({
            status:"Success",
            user_length:users.length,
            data:users
        })
    } catch (error) {
        res.status(500).json({
            status:"Failed",
            mesage:"Internal server error",
            error:error.message
        })
    }
}

export const updateUser =async (req,res)=>{
    try {
        const id = req.user._id;
        const user = await userModel.findOneAndUpdate(id,req.body,{
            new:true,
            runValidators: true
        });
        res.status(201).json({
            status:"Success",
            message:"User Updated",
        })
    } catch (error) {
        res.status(500).json({
            status:"Failed",
            message:"Internal Server Error",
            error:error.message
        });
    }
}

export const deleteUser = async (req,res)=>{
    try {
        const id = req.user._id;
        const user = await userModel.deleteOne({_id:id});
        res.status(201).json({
            status:"Success",
            message:"User Deleted ",
            data:user
        })
    } catch (error) {
        res.status(500).json({
            status:"Failed",
            message:"Internal Server Error",
            error:error.message
        })
    }
}

export const deleteAllUsers = async (req,res)=>{
    try {
        const users = await userModel.deleteMany({role:{$ne:'admin'}});
        res.status(201).json({
            status:"Success",
            message:"Users Deleted",
            data:users
        })
    } catch (error) {
        res.status(500).json({
            status:"Failed",
            message:"Internal Server Error"
        })
    }
}

export const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({
        status:"Failed",
        message: 'User not found' 
    });

    if (user.isVerified) {
        return res.status(400).json({
            status:"Failed",
            message: 'User already verified' 
        });
    }

    const isOTPValid = user.otp === otp && user.otpExpiresAt > new Date();

    if (!isOTPValid) {
        return res.status(400).json({
            status:"Failed",
            message: 'Invalid or expired OTP' 
        });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    res.status(200).json({
        status:"Success",
        message: 'Email verified successfully' 
    });
};

export const resendOTP = async (req, res) => {
    const { email } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
        return res.status(400).json({ message: 'User is already verified' });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    await sendOTPEmail(user.email, otp);

    res.status(200).json({ message: 'New OTP sent to email' });
};

export const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(404).json({
            status:"Failed",
            message: 'User not found'
        });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpires = otpExpires;
    await user.save();


    await sendOTPEmail(user.email, otp);
    res.status(200).json({
        status:"Success",
        message: 'OTP sent to email for password reset'
    });
};

export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    const user = await userModel.findOne({ email });
    if (!user || user.resetPasswordOTP !== otp || new Date() > user.resetPasswordOTPExpires) {
        return res.status(400).json({
            status:"Failed",
            message: 'Invalid or expired OTP'
        });
    }

    user.password = newPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpires = undefined;
    await user.save();

    res.status(200).json({
        status:"Success",
        message: 'Password reset successful'
    });
};
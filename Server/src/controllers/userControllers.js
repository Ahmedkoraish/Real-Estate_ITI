import userModel from "../models/userModel.js"
export const getAllUsers = async (req,res)=>{  
    try {
        const users = await userModel.find({});

        if(users.length===0){
            return res.status(404).json({
                status:"Failed",
                message:"No Users Found",
                data:users
            })
        }
        res.status(201).json({
            Status:"Success",
            User_Length:users.length,
            Data:users
        })
    } catch (error) {
        res.status(500).json({
            Status:"Failed",
            Message:"Internal server error",
            Error:error.message
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
            Status:"Success",
            Message:"User Udated",
            Data:user,
        })
    } catch (error) {
        res.status(500).json({
            Status:"Failed",
            Message:"Internal Server Error",
            Error:error.message
        });
    }
}

export const deleteUser = async (req,res)=>{
    try {
        const id = req.user._id;
        const user = await userModel.deleteOne({_id:id});
        res.status(201).json({
            Status:"Success",
            Message:"User Deleted ",
            Data:user
        })
    } catch (error) {
        res.status(500).json({
            Status:"Failed",
            Message:"Internal Server Error",
            Error:error.message
        })
    }
}

export const deleteAllUsers = async (req,res)=>{
    try {
        const users = await userModel.deleteMany();
        res.status(201).json({
            Status:"Success",
            Message:"Users Deleted",
            Data:users
        })
    } catch (error) {
        res.status(500).json({
            Status:"Failed",
            Message:"Internal Server Error"
        })
    }
}
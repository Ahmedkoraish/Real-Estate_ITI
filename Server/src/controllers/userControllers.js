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
            message:"User Udated",
            data:user,
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
        const users = await userModel.deleteMany();
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
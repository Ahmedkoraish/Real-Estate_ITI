import listModel from '../models/listModel.js'

export const createList = async (req,res) => {
    try {
        req.body.host = req.user._id;

        const list = await listModel.create(req.body);

        res.status(201).json({
            status:"Success",
            message:"List Created",
            data:list
        })
    } catch (error) {
        res.status(500).json({
            status:"Failed",
            message:"Internal Server Error",
            error:error.message
        })
    }
}

export const readLists = async (req,res)=> {
    try {
        
        const lists = await listModel.find({host:req.user._id});
        res.status(201).json({
            status:"Success",
            data:lists
        })
    } catch (error) {
        res.status(500).json({
            status:"Failed",
            message:"Internal Server Error",
            error:error.message
        })
    }
}

export const updateList = async (req,res)=> {
    try {
        const {id} = req.params;
        const list = await listModel.findByIdAndUpdate(id,req.body,{
            new:true,
            runValidators:true
        });
        res.status(201).json({
            status:"Success",
            data: list
        })
    } catch (error) {
        res.status(500).json({
            status:"Failed",
            message:"Internal Server Error",
            error:error.message
        })
    }
}

export const deleteList = async (req,res)=> {
    try {
        const {id} = req.params;
        const list  = await listModel.deleteOne({_id:id});
        res.status(201).json({
            status:"Success",
            message:"List Deleted",
            data:list
        })
    } catch (error) {
        res.status(500).json({
            status:"Failed",
            message:"Internal Server Error",
            error:error.message
        })
    }
}
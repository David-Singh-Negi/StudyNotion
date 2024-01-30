const Category = require('../models/Category');

exports.createCategory = async(req,res) => {
    try{
        const{name,description} = req.body;

        if(!name || !description){
            return res.status(401).json({
                success:false,
                message:"Enter all Values",
            })
        }

        const user = await Category.create({name:name,description:description});
        console.log(user);

        return res.status(200).json({
            success:true, 
            message:"Category created successfully"
        })
    }
    catch(error){
        console.log("Error while Creating Category",error);
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

exports.showAllCategories = async(req,res) => {
    try{
        // console.log("Category Response : ");

        const response = await Category.find({},{name:true, description:true});
        // console.log("Category Response : ",response);
        return res.status(200).json({
            success:true,
            message:"All Category found successfully",
            response
        })
    }
    catch(error){
        console.log("Error while Getting Category",error);
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

exports.categoryPageDetails = async(req,res) => {
    try{
        const {categoryId}= req.body;
        const selectedCategory = await Category.findById(categoryId)
                           .populate('courses').exec();

        if(!selectedCategory){
            return res.status(404).json({
                success:false,
                message:"Course not found"
            })
        }

        const differentCategories = await Category.findById({
            _id:{$ne:categoryId}
        }).populate('courses').exec();

        return res.status(200).json({
            success:true,
            data:{
                selectedCategory,
                differentCategories
            }
        })

    }
    catch(error){
        console.log("Error while Getting Category Page Details",error);
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}
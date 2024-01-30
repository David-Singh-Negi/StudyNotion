const Section = require('../models/Section');
const Course = require('../models/Course');

exports.createSection = async(req,res) => {
    try{
        const{sectionName,courseId} = req.body;

        if(!sectionName || !courseId){
            return res.status(403).json({
                success:false,
                message:"Enter all required details"
            })
        }

        const newSection = await Section.create({sectionName});

        const updatedSectionDetails = await Course.findByIdAndUpdate(courseId,{$push:{courseContent:newSection._id}},{new:true})
        .populate({
            path: "courseContent",
            populate: {
                path: "subSection",
            },
        })
        .exec();

         res.status(200).json({
            success:true,
            message:"Section created successfully",
            updatedSectionDetails
        })

    }
    catch(error){
        console.log("Error while Creating Section",error);
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

// updateSection

exports.updateSection = async(req,res) => {
    try{
        const{sectionName,sectionId} = req.body;

        if(!sectionName || !sectionId){
            return res.status(403).json({
                success:false,
                message:"Enter all required details"
            })
        }

        const section = await Section.findByIdAndUpdate(sectionId,{sectionName});

         res.status(200).json({
            success:true,
            message:"Section updated successfully",
        })

    }
    catch(error){
        console.log("Error while Updatind Section",error);
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}


// deleteSection

exports.deleteSection = async(req,res) => {
    try{
        const {sectionId} = req.params;
        
        await Section.findByIdAndDelete(sectionId);

        res.status(200).json({
            success:true,
            message:"Section deleted Succesfully"
        })

    }
    catch(error){
        console.log("Error while Deleting Section",error);
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

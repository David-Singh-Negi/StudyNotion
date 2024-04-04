const Section = require('../models/Section');
const Course = require('../models/Course');
const SubSection = require('../models/SubSection');

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

exports.updateSection = async (req, res) => {
	try {
		const { sectionName, sectionId,courseId } = req.body;
		const section = await Section.findByIdAndUpdate(
			sectionId,
			{ sectionName },
			{ new: true }
		);

		const course = await Course.findById(courseId)
		.populate({
			path:"courseContent",
			populate:{
				path:"subSection",
			},
		})
		.exec();

		res.status(200).json({
			success: true,
			message: section,
			data:course,
		});
	} catch (error) {
		console.error("Error updating section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

// exports.updateSection = async(req,res) => {
//     try{
//         const{sectionName,sectionId} = req.body;

//         if(!sectionName || !sectionId){
//             return res.status(403).json({
//                 success:false,
//                 message:"Enter all required details"
//             })
//         }

//         const section = await Section.findByIdAndUpdate(sectionId,{sectionName});

//          res.status(200).json({
//             success:true,
//             message:section
//         })

//     }
//     catch(error){
//         console.log("Error while Updatind Section",error);
//         console.error(error);
//         return res.status(500).json({
//             success:false,
//             message:"Internal Server Error"
//         })
//     }
// }


// deleteSection

// exports.deleteSection = async(req,res) => {
//     try{
//         const {sectionId} = req.params;
        
//         await Section.findByIdAndDelete(sectionId);

//         res.status(200).json({
//             success:true,
//             message:"Section deleted Succesfully"
//         })

//     }
//     catch(error){
//         console.log("Error while Deleting Section",error);
//         console.error(error);
//         return res.status(500).json({
//             success:false,
//             message:"Internal Server Error"
//         })
//     }
// }

exports.deleteSection = async (req, res) => {
    try {
        const { sectionId, courseId } = req.body;
        
        // find section 
        const section = await Section.findById(sectionId);
        console.log(sectionId, courseId);

        // find Course 
        await Course.findByIdAndUpdate(courseId, {
            $pull: {
                courseContent: sectionId,
            }
        });

        if (!section) {
            return res.status(404).json({
                success: false,
                message: "Section not Found",
            });
        }

        // Delete sub section
        // await SubSectionModal.deleteMany({_id: {$in: section.subSection}});
        await SubSection.deleteMany({_id: {$in: section.subSection}});

        await Section.findByIdAndDelete(sectionId);

        // Find the updated course and return 
        const course = await Course.findById(courseId).populate({
            path: "courseContent",
            populate: {
                path: "subSection"
            }
        }).exec();

        res.status(200).json({
            success: true,
            message: "Section deleted",
            data: course
        });
    } catch (error) {
        console.error("Error deleting section:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


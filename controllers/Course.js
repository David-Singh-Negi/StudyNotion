const Category = require('../models/Category');
const User = require('../models/User');
const Course = require('../models/Course');
const{uploadImageToCloudinary} = require('../Utils/imageUploader');

exports.createCourse = async(req,res) => {
    try{
        const {
            courseName,
            courseDescription,
            price,
            tag,
            category,
            status,
            instructions,
            whatYouWillLearn} = req.body;

        const thumbnail = req.files.thumbnailImage;
        if(!courseName || 
            !courseDescription || 
            !price ||
            !whatYouWillLearn || 
            !tag ||
            !category ||
            !thumbnail){
                
            return res.status(403).json({
                success:false,
                message:"All fields required"
            })
        }
        

        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log("instructor Details --> ",instructorDetails);

        if(!instructorDetails){
            return res.status(404).json({
                success:false,
                message:"Instructor not found"
            })
        }
        
        const categoryDetails = await Category.findById(category);

        if(!categoryDetails){
            return res.status(404).json({
                success:false,
                message:"categoryDetails not found"
            })
        }

        const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);

        const newCourse = await Course.create({
            courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            instructor:instructorDetails._id,
            category:categoryDetails._id,
            thumbnail:thumbnailImage.secure_url
        })

        await User.findByIdAndUpdate({_id:instructorDetails._id},
            {
                $push:{courses:newCourse._id}
            },
            {new:true} 
        );

        await Category.findByIdAndUpdate({_id:categoryDetails._id},
            {
                $push:{course:newCourse._id}
            },
            {new:true} 
        );

        return res.status(200).json({
            success:true,
            message:"Course created Successfully",
            data:newCourse
        })

    }
    catch(error){
        console.log("Error while Creating Courses",error);
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}


exports.getAllCourses = async(req,res) => {
    try{
        const allCourses = await Course.find({},{ 
            courseName:true,
            instructor:true,
            ratingAndReview:true,
            price:true,thumbnail:true,
            studentsEnrolled:true }).populate("instructor").exec();

        return res.status(200).json({
            success:true,
            message:"all Courses found successfully",
            data:allCourses
        })

    }
    catch(error){
        console.log("Error while Getting Courses : ",error);
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

// course details

exports.getCourseDetails = async(req,res) => {
    try{
        const{courseId} = req.body;

        const courseDetails = await Course.findById({_id:courseId})
        .populate({
            path:"instructor",
            populate:{
                path:"additionalDetails"
            }
        })
        .populate('category')
        .populate('ratingAndReview')
        .populate({
            path : "courseContent",
            populate:{
                path:"subSection"
            }
        }).exec();

        // validation
        if(!courseDetails){
            return res.status(400).json({
                success:false,
                message:`Coudn't find course ${courseId}`
            })
        }

        return res.status(200).json({
            success:true,
            message:"Data fetched Successfully",
            data:courseDetails,
        })
    }
    catch(error){
        console.log("Error while getting all Courses");
        console.error(error);
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}
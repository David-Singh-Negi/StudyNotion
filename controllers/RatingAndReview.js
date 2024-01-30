const RatingAndReview= require('../models/RatingAndReview');
const Course = require('../models/Course');
const mongoose = require('mongoose');

// create Rating
exports.createRating = async(req,res) => {
    try{
        const userId = req.user.id;
        const{rating,review,courseId} = req.body;

        // check if student  enrolled or not
        const courseDetails = await Course.findOne({_id:courseId,
                          studentEnrolled:{$elemMatch:{$eq:userId}}}
        );

        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:`Data not found :  ${courseId}`
            })
        }

        // check if already reviewd
        const alreadyReviewd = await RatingAndReview.findOne({
                                            user:userId,
                                            course:courseId
        })

        if(alreadyReviewd){
            return res.status(403).json({
                success:false,
                message:`Course Already reviewed`
            })
        }

        // create Rating and Reviw
        const ratingReview = await RatingAndReview.create({
            rating,review,
            user:userId,
            course:courseId
        });

        // update in course's rating
        await Course.findByIdAndUpdate({_id:courseId},
                                    {
                                        $push:{ratingAndReview:ratingReview._id}
                                    },{new:true}
        );

        return res.status(200).json({
            success:true,
            message:"Rating & Review created Successfully",
            ratingReview,
        })
    }
    catch(error){
        console.log("Error while creating Rating & review");
        console.error(error);
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}


// Get average Rating

exports.getAverageRating = async(req,res) => {
    try{

        const courseId = req.body.courseId;
        const result = await RatingAndReview.aggregate([
            {
                $match:{
                    course: new mongoose.Types.ObjectId(courseId),
                }
            },
            {
                $group:{
                    _id:null,
                    averageRating:{ $avg : "$rating"}
                }
            }
        ])
        
        if(result.length > 0){
            return res.status(200).json({
                success:true,
                averageRating:result[0].averageRating,
            })
        }

        // if no review exist
        return res.status(200).json({
                success:true,
                message:"Average Rating is 0 till now !",
                averageRating:0,
            })

    }
    catch(error){
        console.log("Error while creating Rating & review");
        console.error(error);
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}


// create Rating

exports.getAllRating = async(req,res) => {
    try{
        const allReviews = await RatingAndReview.find({})
                                 .sort({rating:"desc"})
                                 .populate({
                                    path:"user",
                                    select:"email firstName lastName image"
                                 })
                                 .populate({
                                    path:"course",
                                    select:"courseName"
                                 }).exec();
        
         return res.status(200).json({
            success:true,
            message:"all reviews fetched successfylly",
            averageRating:0,
        })
    }
    catch(error){
        console.log("Error while getting reviews");
        console.error(error);
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}
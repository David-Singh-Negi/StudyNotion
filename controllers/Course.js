const Category = require('../models/Category');
const User = require('../models/User');
const Course = require('../models/Course');
const CourseProgress = require('../models/CourseProgress');
const{uploadImageToCloudinary} = require('../Utils/imageUploader');
const {convertSecondsToDuration} = require('../Utils/secToDuration');
const Section = require('../models/Section');
const SubSection = require('../models/SubSection');

// exports.createCourse = async(req,res) => {
//     try{
//         const {
//             courseName,
//             courseDescription,
//             price,
//             tag,
//             category,
//             status,
//             instructions,
//             whatYouWillLearn} = req.body;

//         const thumbnail = req.files.thumbnailImage;
//         if(!courseName || 
//             !courseDescription || 
//             !price ||
//             !whatYouWillLearn || 
//             !tag ||
//             !category 
//             || !thumbnail
//             ){
                
//             return res.status(403).json({
//                 success:false,
//                 message:"All fields required"
//             })
//         }
        

//         const userId = req.user.id;
//         const instructorDetails = await User.findById(userId);
//         console.log("instructor Details --> ",instructorDetails);

//         if(!instructorDetails){
//             return res.status(404).json({
//                 success:false,
//                 message:"Instructor not found"
//             })
//         }
        
//         const categoryDetails = await Category.findById(category);

//         if(!categoryDetails){
//             return res.status(404).json({
//                 success:false,
//                 message:"categoryDetails not found"
//             })
//         }

//         const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);

//         const newCourse = await Course.create({
//             courseName,
//             courseDescription,
//             whatYouWillLearn,
//             tag,
//             price,
//             instructor:instructorDetails._id,
//             category:categoryDetails._id,
//             status,
//             instructions,
//             thumbnail:thumbnailImage.secure_url
//         })

//         await User.findByIdAndUpdate({_id:instructorDetails._id},
//             {
//                 $push:{courses:newCourse._id}
//             },
//             {new:true} 
//         );

//         await Category.findByIdAndUpdate({_id:categoryDetails._id},
//             {
//                 $push:{course:newCourse._id}
//             },
//             {new:true} 
//         );

//         return res.status(200).json({
//             success:true,
//             message:"Course created Successfully",
//             data:newCourse
//         })

//     }
//     catch(error){
//         console.log("Error while Creating Courses",error);
//         console.error(error);
//         return res.status(500).json({
//             success:false,
//             message:"Internal Server Error"
//         })
//     }
// }

// exports.createCourse = async (req, res) => {
//   try {
//     // Get user ID from request object
//     const userId = req.user.id

//     // Get all required fields from request body
//     let {
//       courseName,
//       courseDescription,
//       whatYouWillLearn,
//       price,
//       tag: _tag,
//       category,
//       status,
//       instructions: _instructions,
//     } = req.body
//     console.log("req.body",req.body);
//     // Get thumbnail image from request files
//     const thumbnail = req.files.thumbnailImage

    

//     // Convert the tag and instructions from stringified Array to Array
//     const tag = JSON.parse(_tag)
//     const instructions = JSON.parse(_instructions)

//     console.log("tag", tag)
//     console.log("instructions", instructions)

//     // Check if any of the required fields are missing
//     if (
//       !courseName ||
//       !courseDescription ||
//       !whatYouWillLearn ||
//       !price ||
//       !tag.length ||
//       !thumbnail ||
//       !category ||
//       !instructions.length
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "All Fields are Mandatory",
//       })
//     }
//     if (!status || status === undefined) {
//       status = "Draft"
//     }
//     // Check if the user is an instructor
//     const instructorDetails = await User.findById(userId, {
//       accountType: "Instructor",
//     })

//     if (!instructorDetails) {
//       return res.status(404).json({
//         success: false,
//         message: "Instructor Details Not Found",
//       })
//     }

//     // Check if the tag given is valid
//     const categoryDetails = await Category.findById(category)
//     if (!categoryDetails) {
//       return res.status(404).json({
//         success: false,
//         message: "Category Details Not Found",
//       })
//     }
//     // Upload the Thumbnail to Cloudinary
//     const thumbnailImage = await uploadImageToCloudinary(
//       thumbnail,
//       process.env.FOLDER_NAME
//     )
//     console.log(thumbnailImage)
//     // Create a new course with the given details
//     const newCourse = await Course.create({
//       courseName,
//       courseDescription,
//       instructor: instructorDetails._id,
//       whatYouWillLearn: whatYouWillLearn,
//       price,
//       tag,
//       category: categoryDetails._id,
//       thumbnail: thumbnailImage.secure_url,
//       status: status,
//       instructions,
//     })

//     // Add the new course to the User Schema of the Instructor
//     await User.findByIdAndUpdate(
//       {
//         _id: instructorDetails._id,
//       },
//       {
//         $push: {
//           courses: newCourse._id,
//         },
//       },
//       { new: true }
//     )
//     // Add the new course to the Categories
//     const categoryDetails2 = await Category.findByIdAndUpdate(
//       { _id: category },
//       {
//         $push: {
//           courses: newCourse._id,
//         },
//       },
//       { new: true }
//     )
//     console.log("HEREEEEEEEE", categoryDetails2)
//     // Return the new course and a success message
//     res.status(200).json({
//       success: true,
//       data: newCourse,
//       message: "Course Created Successfully",
//     })
//   } catch (error) {
//     // Handle any errors that occur during the creation of the course
//     console.error(error)
//     res.status(500).json({
//       success: false,
//       message: "Failed to create course",
//       error: error.message,
//     })
//   }
// }

// exports.editCourse = async (req, res) => {
//     try {
//       const { courseId } = req.body
//       const updates = req.body
//       const course = await Course.findById(courseId)
  
//       if (!course) {
//         return res.status(404).json({ error: "Course not found" })
//       }
  
//       // If Thumbnail Image is found, update it
//       if (req.files) {
//         console.log("thumbnail update")
//         const thumbnail = req.files.thumbnailImage
//         const thumbnailImage = await uploadImageToCloudinary(
//           thumbnail,
//           process.env.FOLDER_NAME
//         )
//         course.thumbnail = thumbnailImage.secure_url
//       }
  
//       // Update only the fields that are present in the request body
//       for (const key in updates) {
//         if (updates.hasOwnProperty(key)) {
//           if (key === "tag" || key === "instructions") {
//             course[key] = JSON.parse(updates[key])
//           } else {
//             course[key] = updates[key]
//           }
//         }
//       }
  
//       await course.save()
  
//       const updatedCourse = await Course.findOne({
//         _id: courseId,
//       })
//         .populate({
//           path: "instructor",
//           populate: {
//             path: "additionalDetails",
//           },
//         })
//         .populate("category")
//         .populate("ratingAndReviews")
//         .populate({
//           path: "courseContent",
//           populate: {
//             path: "subSection",
//           },
//         })
//         .exec()
  
//       res.json({
//         success: true,
//         message: "Course updated successfully",
//         data: updatedCourse,
//       })
//     } catch (error) {
//       console.error(error)
//       res.status(500).json({
//         success: false,
//         message: "Internal server error",
//         error: error.message,
//       })
//     }
//   }

exports.createCourse = async (req, res) => {
	try {
		// Get user ID from request object
		const userId = req.user.id;
    console.log("PPPPPPPPPP +:::+++",req.body,"+++++++++++++")


		// Get all required fields from request body
		let {
			courseName,
			courseDescription,
			whatYouWillLearn,
			price,
			tag,
			category,
			status,
			instructions,
		} = req.body;

    console.log("req.body : ",req.body);

		 //Get thumbnail image from request files
		const thumbnail = req.files.thumbnailImage;

		// Check if any of the required fields are missing
		if (
			!courseName ||
			!courseDescription ||
			!whatYouWillLearn ||
			!price ||
			!tag ||
			!thumbnail ||
			!category
		) {
			return res.status(400).json({
				success: false,
				message: "All Fields are Mandatory",
			});
		}
		if (!status || status === undefined) {
			status = "Draft";
		}
		// Check if the user is an instructor
		const instructorDetails = await User.findById(userId, {
			accountType: "Instructor",
		});

		if (!instructorDetails) {
			return res.status(404).json({
				success: false,
				message: "Instructor Details Not Found",
			});
		}

		// Check if the tag given is valid
		const categoryDetails = await Category.findById(category);
		if (!categoryDetails) {
			return res.status(404).json({
				success: false,
				message: "Category Details Not Found",
			});
		}
		// Upload the Thumbnail to Cloudinary
		const thumbnailImage = await uploadImageToCloudinary(
			thumbnail,
			process.env.FOLDER_NAME
		);
		console.log(thumbnailImage);
		 //Create a new course with the given details
		const newCourse = await Course.create({
			courseName,
			courseDescription,
			instructor: instructorDetails._id,
			whatYouWillLearn: whatYouWillLearn,
			price,
			tag: tag,
			category: categoryDetails._id,
			thumbnail: thumbnailImage.secure_url,
			status: status,
			instructions: instructions,
		});

		// Add the new course to the User Schema of the Instructor
		await User.findByIdAndUpdate(
			{
				_id: instructorDetails._id,
			},
			{
				$push: {
					courses: newCourse._id,
				},
			},
			{ new: true }
		);
		// Add the new course to the Categories
		await Category.findByIdAndUpdate(
			{ _id: category },
			{
				$push: {
					courses: newCourse._id,
				},
			},
			{ new: true }
		);
		// Return the new course and a success message
		res.status(200).json({
			success: true,
			data: newCourse,
			message: "Course Created Successfully",
		});
	} catch (error) {
		// Handle any errors that occur during the creation of the course
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Failed to create course",
			error: error.message,
		});
	}
};

exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body
    const updates = req.body
    const course = await Course.findById(courseId)

    if (!course) {
      return res.status(404).json({ error: "Course not found" })
    }

    // If Thumbnail Image is found, update it
    if (req.files) {
      console.log("thumbnail update")
      const thumbnail = req.files.thumbnailImage
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      )
      course.thumbnail = thumbnailImage.secure_url
    }

    // Update only the fields that are present in the request body
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (key === "tag" || key === "instructions") {
          course[key] = JSON.parse(updates[key])
        } else {
          course[key] = updates[key]
        }
      }
    }

    await course.save()

    const updatedCourse = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReview")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
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

exports.getFullCourseDetails = async(req,res) => {
  try{
    const {courseId} = req.body;
    const userId = req.user.id;

    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReview")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    const courseProgressCount = await CourseProgress.findOne({
      courseId:courseId,
      userId:userId
    });

    if(!courseDetails){
      res.status(400).json({
        status:false,
        messsage:`Couldn't Find Course with id : ${courseId} `
      })
    }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    console.log("CourseDetails : >>>>",courseDetails)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    })

  }
  catch(error){
    console.log("Error in getting Full Coursese");
    console.error(error);
    return res.status(500).json({
      success:false,
      message:error.message
    })
  }
}

exports.getInstructorCourses = async(req,res) => {
  try{
    const instructorId = req.user.id;

    const instructorCourses = await Course.find({
      instructor:instructorId
    }).sort({createdAt:-1});

    return res.status(200).json({
      success:true,
      data:instructorCourses
    })
  }
  catch(error){
    console.log("Error while fetching instructor coursese");
    console.error(error);
    return res.status(500).json({
      success:false,
      message:"Error while fetching instructor coursese",
      error:error.message
    })
  }
}

exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body

    // Find the course
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentsEnrolled
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      })
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId)
      if (section) {
        const subSections = section.subSection
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId)
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId)
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId)

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}
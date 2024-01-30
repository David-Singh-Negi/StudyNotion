const Profile = require('../models/Profile');
const User = require('../models/User');
const Course = require('../models/Course');
const{uploadImageToCloudinary} = require('../Utils/imageUploader');

exports.updateProfile = async(req,res) => {
    try{
        const{gender,dateOfBirth="",about="",contactNumber} = req.body;
        const id = req.user.id; 
        
        if(!contactNumber || !gender || !id){
            return res.status(403).json({
                success:false,
                message:"All fields required"
            })
        }

        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);

        profileDetails.gender = gender;
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.contactNumber = contactNumber;
        await profileDetails.save();

        return res.status(200).json({
            success:true,
            message:"Profile Updated Successfully",
            profileDetails
        })
    }
    catch(error){
        console.log("Error while Updating Profile : ",error);
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

// deletind Account

exports.deleteAccount = async(req,res) => {
    try{
        const id = req.user.id;

        const userDetails = await User.findById(id);

        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"Data not found",
            })
        }

        const deleteProfile = await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});

        await Course.findByIdAndDelete(userDetails._id);

        await User.findByIdAndDelete({_id:id});

        return res.status(200).json({
            success:true,
            message:"Profile Deleted Successfully",
        })
    }
    catch(error){
        console.log("Error while Deleting Profile : ",error);
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}


// getall details

exports.getUserDetails = async(req,res) => {
    try{
        const id = req.user.id;

        const userDetails = await User.findById(id).populate('additionalDetails').exec();

        return res.status(200).json({
            success:true,
            message:"User Deatils found Successfully",
            userDetails
        })
    }
    catch(error){
        console.log("Error while getting Profile Details : ",error);
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
};


exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture;
      const userId = req.user.id
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};


exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      const userDetails = await User.findOne({
        _id: userId,
      })
        .populate("courses")
        .exec()
      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};
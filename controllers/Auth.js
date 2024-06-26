const User = require('../models/User');
const OTP = require('../models/OTP');
const Profile = require('../models/Profile');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const { mailsender } = require('../Utils/mailSender');
const jwt = require('jsonwebtoken');
const { passwordUpdated } =  require('../mail/templates/passwordUpdate');
require('dotenv').config();

// sign up
exports.sendOTP = async(req,res) => {
    try{
        const {email} = req.body;
        const emailChecker = await User.findOne({email});

        if(emailChecker){
            return res.status(400).json({
                success:false,
                message:"User already exists"
            })
        }

        var otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        });

        // console.log("OTP Generated : ",otp);

        // check OTP to be unique
        let result = await OTP.findOne({otp:otp});

        while(result){
            var otp = otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false
            });
            result = await OTP.findOne({otp:otp});
        }

        const otpPayload = {email,otp};

        const otpBody = await OTP.create(otpPayload);
        // console.log("OTP body : ",otpBody);

        res.json({
            success:true,
            message:"OTP generated successfully",
            otp,
        })
    
    }
    catch(error){
        console.log("Error while sending OTP",error);
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}



// signup
exports.signUp = async(req,res) => {
    try{
        const{firstName,lastName,email,password,confirmPassword,accountType,contactNumber,otp} = req.body;
        // all fiels empty or not
        console.log("Signup Data :",req.body);
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success:false,
                message:"All fields require"
            })
        }
// match both password
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password Don't match,try again"
            })
        }
// if email exists
        const emailChecker = await User.findOne({email});

        if(emailChecker){
            return res.status(400).json({
                success:false,
                message:"User already exists"
            })
        }
// find recent OTP
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log("Recent OTP : ",recentOtp);

        if(recentOtp.length === 0){
            return res.status(400).json({
                success:false,
                message:"OTP not found"
            })
        }
        else if(otp !== recentOtp[0].otp){
            return res.status(400).json({
                success:false,
                message:"OTP Invalid"
            })
        }
// hash password
        const hashedPassword = await bcrypt.hash(password,10);

        const profileDetails = await Profile.create({gender:null,dateOfBirth:null,about:null,contactNumber:null});

        // db entry
        const user = await User.create({
            firstName,lastName,email,password:hashedPassword,contactNumber,accountType,additionalDetails:profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        })

        res.status(200).json({
            success:true,
            message:"User successfully registered",
            user
        })
    }

    catch(error){
        console.log("Error while signing up",error);
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}


// login
exports.logIn = async(req,res) => {
    try{
        const{email,password} = req.body;

        if(!email || !password){
            return res.status(403).json({
                success:true,
                message:"Fill all details"
            })
        }

        const user = await User.findOne({email}).populate('additionalDetails');

        if(!user){
            return res.status(400).json({
                success:true,
                message:"Register yourself first"
            })
        }

        if(await bcrypt.compare(password,user.password)){
            const payload = {
                email:user.email,
                id:user._id,
                accountType:user.accountType
            }
            const token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h"
            })
            // user.token = toObject();
            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly:true
            }

            res.cookie('token',token,options).status(200).json({
                success:true,
                token,
                user,
                message:"User Logged in Successfully"
            })
        }
        else{
            return res.status(401).json({
                success:false,
                message:"Password Incorrect"
            })
        }
    }
    catch(error){
        console.log("Error while logging in",error);
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Error while logging in"
        })
    }
}

// Change Password

exports.changePassword = async (req, res) => {
    try {
      // Get user data from req.user
      const userDetails = await User.findById(req.user.id)
  
      // Get old password, new password, and confirm new password from req.body
      const { oldPassword, newPassword } = req.body
  
      // Validate old password
      const isPasswordMatch = await bcrypt.compare(
        oldPassword,
        userDetails.password
      )
      if (!isPasswordMatch) {
        // If old password does not match, return a 401 (Unauthorized) error
        return res
          .status(401)
          .json({ success: false, message: "The password is incorrect" })
      }
  
      // Update password
      const encryptedPassword = await bcrypt.hash(newPassword, 10)
      const updatedUserDetails = await User.findByIdAndUpdate(
        req.user.id,
        { password: encryptedPassword },
        { new: true }
      )
  
      // Send notification email
      try {
        const emailResponse = await mailsender(
          updatedUserDetails.email,
          passwordUpdated(
            updatedUserDetails.email,
            `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
          ),
          "Password for your account has been updated"
        )
        console.log("Email sent successfully:", emailResponse.response)
      } catch (error) {
        // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
        console.error("Error occurred while sending email:", error)
        return res.status(500).json({
          success: false,
          message: "Error occurred while sending email",
          error: error.message,
        })
      }
  
      // Return success response
      return res
        .status(200)
        .json({ success: true, message: "Password updated successfully" })
    } catch (error) {
      // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while updating password:", error)
      return res.status(500).json({
        success: false,
        message: "Error occurred while updating password",
        error: error.message,
      })
    }
  }
  
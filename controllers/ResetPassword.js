const { mailsender } = require('../Utils/mailSender');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

exports.resetPasswordToken = async(req,res) => {
    try{
        const email = req.body.email;

        const user = await User.findOne({email});

        if(!user){
            return res.status(401).json({
                success:false,
                message:"Register yourself first"
            })
        }

        const token = crypto.randomUUID();

        const updatedDetails = await User.findOneAndUpdate({email:email},{
            token:token,
            resetPasswordExpires:Date.now() + 5*60*1000
        },{new:true});

        const url = `http://localhost:3000/update-password/${token}`;

        await mailsender(email,`Change Link - ${url}`,"Password Reset Link");

        res.json({
            success:true,
            message:"Password Reset message sent Successfully. Check Email"
        })
    }
    catch(error){
        console.log("Error while generating Password Token ",error);
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Error while generating Password Token "
        })
    }
}


exports.resetPassword = async(req,res) => {
    try{
        const {password,confirmPassword,token} = req.body;
        console.log("REq.body : ",req.body);
        console.log("reset pass : ",password,confirmPassword,token);

        if(confirmPassword !==  password ){
            return res.status(403).json({
                success:false,
                message:"New Password & Confirm Password do not match"
            })
        }

        const userDetails = await User.findOne({token:token});

        if(!userDetails){
            return res.status(401).json({
                success:false,
                message:"Token Invalid"
            })
        }

        if(userDetails.resetPasswordExpires < Date.now() ){
            return res.status(401).json({
                success:false,
                message:"Token Expired, try again"
            })
        }

        const newHashPassword = await bcrypt.hash(password,10);

        // const response = await User.findOneAndUpdate({password:newHashPassword},{new:true});

        await User.findOneAndUpdate({token:token},{password:newHashPassword},{new:true});

        res.status(200).json({
            success:true,
            message:"Password reset Successfully",
            // response
        })
        
    }
    catch(error){
        console.log("Error while Password reset",error);
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Error while Password reset"
        })
    }
}
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// auth
exports.auth = async(req,res,next) => {
    try{
        const token = req.body.token || req.cookies.token || req.header('Authorisation').replace('Bearer ',"");

        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token Missing"
            })
        }

        try{
            const decode = jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }
        catch(error){
            console.log("Error while Verifying Token : ",error);
            console.error(error);
            return res.status(401).json({
                success:false,
                message:"Token Invaid"
            })
        }
        next();
    }
    catch(error){
        console.log("Error while Validating Token",error);
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Error while Validating Token"
        })
    }
}

// iStudent
exports.isStudent = async(req,res,next) => {
    try{
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is protected route for Students"
            })
        }
        next();
    }
    catch(error){
        console.log("Error while Validating Student",error);
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Role not verified"
        })
    }
}

// isInstructor
exports.isInstructor = async(req,res,next) => {
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is protected route for Instructors"
            })
        }
        next();
    }
    catch(error){
        console.log("Error while Validating Instructor",error);
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Role not verified"
        })
    }
}

// IsAdmin

exports.isAdmin = async(req,res,next) => {
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is protected route for Admin"
            })
        }
        next();
    }
    catch(error){
        console.log("Error while Validating Admin",error);
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Role not verified"
        })
    }
}

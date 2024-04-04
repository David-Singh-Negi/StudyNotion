const Contact = require('../models/ContactUs');

exports.contactFormDetails = async(req,res) => {
    try{
        const{firstName,lastName,email,countrycode,phoneNo,message} = req.body;

        if(!firstName || !lastName || !email || !countrycode || !phoneNo || !message){
            return res.json({
                success:false,
                message:"All fields Required"
            })
        }

        const emailExists = await Contact.findOne({email:email});

        if(emailExists){
            return res.json({
                success:false,
                message:"User Already responded with this email"
            })
        }

        const response = await Contact.create({firstName,lastName,email,countrycode,phoneNo,message});

        return res.status(200).json({
            success:true,
            message:"Contact Details Sent Successfully",
            data:response
        })
    }
    catch(error){
        console.log("Error while Posting Contact Form Cetails");
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Error while Posting Contact Form Cetails"
        })
    }
}
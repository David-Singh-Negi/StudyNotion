const mongoose = require('mongoose');
const { mailsender } = require('../Utils/mailSender');
const otpTemplate = require('../mail/templates/emailVerificationTemplate');

const OTPSchema = new mongoose.Schema({

    email:{
        type:String,
        required:true
    },

    otp:{
        type:String,
        required:true
    },

    createdAt:{
        type:Date,
        default:Date.now(),
        expires: 10*60
    }
})
    

async function sendVerificationEmail(email,otp){
    try{
        const mailResponse = await mailsender(email,
        `${otpTemplate(otp)}`,"Email Verification");
        console.log("EmailSent Successfully",mailResponse);
    }
    catch(error){
        console.log("Error while Sending OTP",error);
        throw error;
    }
}

OTPSchema.pre('save', async function(next) {
    // send a document only if a new document is created
    if(this.isNew){
        await sendVerificationEmail(this.email,this.otp);
    }
    next();
})


module.exports = mongoose.model('OTP',OTPSchema);
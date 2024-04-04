const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },

    lastName:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true
    },

    countrycode:{
        type:String,
        required:true
    },

    phoneNo:{
        type:Number,
        required:true,
        maxLength:10
    },


    message:{
        type:String,
        required:true
    },
});

module.exports = mongoose.model('Contact',ContactSchema);
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({

    courseName:{
        type:String
    },

    courseDescription:{
        type:String
    },

    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },

    whatYouWillLearn:{
        type:String
    },

    ratingAndReview:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'RatingAndReview'
    }],

    courseContent:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Section'
    }],

    price:{
        type:Number
    },

    thumbnail:{
        type:String
    },

    tag: {
        type: [String],
        required: true,
    },

    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },

    studentsEnrolled:[{
        required:true,
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],

    instructions:{
        type:[String],
    },

    status:{
        type:String,
        enum:["Draft","Published"]
    },
});
    

module.exports = mongoose.model('Course',courseSchema);
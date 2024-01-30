const {instance} = require('../config/razorpay');
const User = require('../models/User');
const Course = require('../models/Course');
const {mailsender} = require('../Utils/mailSender');
const {courseEnrollmentEmail} = require('../mail/templates/courseEnrollmentEmail');
const mongoose = require('mongoose');

exports.capturePayment = async(req,res) => {
 
        const {course_id }= req.body;
        const userId = req.user.body;

        if(!course_id){
            return res.json({
                success:false,
                message:"Enter a Valid Course ID"
            })
        }

        let course;
        try{
            course = await Course.findById(course_id);
            if(!course){
                return res.json({
                    success:false,
                    message:"Could not find Course"
                })
            }

            // covert courseId to object id bcse Course has id in Object and here id is String
            const uId = new mongoose.Schema.Types.ObjectId(userId);

            if(course.studentsEnrolled.includes(uId)){
                return res.json({
                    success:false,
                    message:"You have already purchased this Course"
                })
            }
        }

        catch(error){
            return res.status(403).json({
                success:false,
                message:""
            })
        }

        // create order 

        const amount = course.price;
        const currency = "INR";

        const options = {
            amount : amount * 100,
            currency,
            receipt: Math.random(Date.now()).toString(),
            notes:{
                courseid : course_id,
                userId
            }
        }

        // razorPay initiate
        try{
            const paymentResponse = await instance.orders.create(options);
            console.log("Payment response : ",paymentResponse);

            // return response 
            return res.status(200).json({
                success:true,
                courseName:course.courseName,
                courseDescription:course.courseDescription,
                thumbnail:course.thumbnail,
                orderId:paymentResponse.id,
                amount:paymentResponse.amount,
                currency:paymentResponse.currency
            })
        }
        catch(error){
            console.log("Error during Razorpay Initialization",error);
            console.error(error);
            return res.json({
                success:false,
                message:"Internal Server Error"
            })
        }

    }


// verify signature 

exports.verfySignature = async(req,res) => {

        const webhookSecret = "12345678";
        const signature = req.headers('x-razorpay-signature');
        const shasum = crypto.createHmac('sha256',webhookSecret);
        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest('hex');

        if(signature === digest){
            console.log("Payment Authorized")
            const{courseid,userId} = req.body.payload.payment.entity.notes;

            try{
                //  find course and enroll student in it
                const enrolledCourse = await Course.findByIdAndUpdate(
                    {_id:courseid},
                    {$push:{
                            studentsEnrolled:userId
                    }},
                    {new:true}
                )

                if(!enrolledCourse){
                    return res.status(500).json({
                        success:true,
                        message:"Course not found",
                    })
                }
                console.log('enrolledCourse : ',enrolledCourse);


                //  find student and enroll to a course
                const enrolledStudent = await User.findByIdAndUpdate(
                    {_id:userId},
                    {$push:{
                            courses:courseid
                    }},
                    {new:true}
                )

                if(!enrolledStudent){
                    return res.status(500).json({
                        success:true,
                        message:"Course not found",
                    })
                }
                console.log('enrolledStudent : ',enrolledStudent);

                const emailResponse = await mailsender(
                    enrolledStudent.email,
                    "Congrats",
                    "Testing avi baaki h mere dost"
                );

                console.log('emailResponse : ',emailResponse);

                return res.status(200).json({
                    success:true,
                    message:"Signature Verified And Course Added",
                })
        
            }
            catch(error){
                console.log(error);
                return res.status(500).json({
                    success:true,
                    message:"Signature not Verified And Course not Added",
                })
            }
        }

        else{
            return res.status(400).json({
                success:true,
                message:"Invalid Request",
            })
        }

    }
 
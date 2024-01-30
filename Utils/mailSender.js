const Nodemailer = require('nodemailer');

exports.mailsender = async(email,body,title) => {
    try{
        let transporter = Nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS
            }
        });

        let info = await transporter.sendMail({
            from:"StudyNotion || by-David",
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`
        });

        console.log(info);
        return info;
    }
    catch(error){
        console.log("Error in Sending Mail");
        console.error(error);
    }
}
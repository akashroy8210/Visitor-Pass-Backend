const nodemailer=require("nodemailer")
const otpGenerator=require("otp-generator")

exports.generateOTP=()=>{
    return otpGenerator.generate(6,{
        digits:true,
        lowerCaseAlphabets:false,
        upperCaseAlphabets:false,
        specialChars:false
    })
}
exports.sendEmail=async ({to,subject,html})=>{
    try{
        const transporter= nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:process.env.EMAIL,
                pass:process.env.EMAIL_PASS
            }
        })
        await transporter.sendMail({
            from:process.env.EMAIL,
            to,
            subject,
            html
        })
        res.status(200).json({message:"Email Sent Successfully"})
    }catch(error){
        console.log(error)
    }
}

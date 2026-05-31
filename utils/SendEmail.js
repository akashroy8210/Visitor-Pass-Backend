const nodemailer = require("nodemailer")
const otpGenerator = require("otp-generator")
const dotenv = require("dotenv").config()
const {Resend}=require("resend")
exports.generateOTP = () => {
    return otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false
    })
}

// const transporter = nodemailer.createTransport({
//     host: "smtp-relay.brevo.com",
//     port: 587,
//     secure: false,
//     auth: {
//         user: process.env.EMAIL,
//         pass: process.env.EMAIL_PASS
//     },
// })

const resend=new Resend(process.env.RESEND_API_KEY)
exports.sendEmail = async ({ to, subject, html }) => {
    try {
        const info=await resend.emails.send({
            from:"My Office",
            to,
            subject,
            html
        })
        console.log(info)
    } catch (error) {
        console.log(error)
        throw error
    }
}

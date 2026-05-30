const nodemailer = require("nodemailer")
const otpGenerator = require("otp-generator")
const dotenv = require("dotenv").config()
exports.generateOTP = () => {
    return otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false
    })
}

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    },
})
exports.sendEmail = async ({ to, subject, html }) => {
    try {
        const info=await transporter.sendMail({
            from: `My Office <${process.env.SENDER_EMAIL}>`,
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

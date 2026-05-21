const nodemailer = require("nodemailer")
const otpGenerator = require("otp-generator")

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
        await transporter.sendMail({
            from: `My Office <${process.env.EMAIL}>`,
            to,
            subject,
            html
        })
    } catch (error) {
        console.log(error)
        throw error
    }
}

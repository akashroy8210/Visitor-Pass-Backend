const validator = require("validator")
const bcrypt = require("bcrypt")
const User = require("../models/userModel")
const Otp = require("../models/otpModel")
const jwt = require("jsonwebtoken")
const { generateOTP, sendEmail } = require("../utils/SendEmail")
exports.signupUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name, !email, !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email" })
        }
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({ message: "Please Enter Strong Password" })
        }
        const existingUser = await User.findOne({ email })
        const existingOtp = await Otp.findOne({ email })
        if (existingUser && existingUser.isVerified) {
            return res.status(400).json({ message: "User already exists" })
        }
        const otp = generateOTP()
        const salt = await bcrypt.genSalt(10)
        const hashOtp = await bcrypt.hash(otp, salt)
        const hashPassword = await bcrypt.hash(password, salt)
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000)
        await sendEmail({
            to: email,
            subject: "Verify Your Email Address",
            html: `
            <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>OTP Verification</title>
</head>

<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">

        <!-- Main Container -->
        <table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff; margin-top:40px; border-radius:10px; overflow:hidden; box-shadow:0 10px 25px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#4f46e5,#3b82f6); padding:20px; text-align:center; color:#ffffff;">
              <h2 style="margin:0;">🔐 Verify Your Identity</h2>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px; color:#333;">
              
              <p style="font-size:16px;">Hello <b>${name}</b>,</p>

              <p style="font-size:14px; color:#555;">
                Thank you for registering as a visitor. Please use the OTP below to complete your verification.
              </p>

              <!-- OTP Box -->
              <div style="text-align:center; margin:30px 0;">
                <span style="
                  display:inline-block;
                  background:#f1f5f9;
                  padding:15px 30px;
                  font-size:28px;
                  letter-spacing:5px;
                  font-weight:bold;
                  color:#111827;
                  border-radius:8px;
                ">
                  ${otp}
                </span>
              </div>

              <p style="font-size:14px; color:#555;">
                This OTP is valid for <b>5 minutes</b>. Do not share it with anyone.
              </p>

              <p style="font-size:13px; color:#999;">
                If you did not request this, please ignore this email.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px; text-align:center; font-size:12px; color:#888;">
              © 2026 Your My Office. All rights reserved.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
            `
        })

        let user;
        if (existingUser) {
            existingUser.name = name
            existingUser.email = email
            existingUser.password = hashPassword
            existingOtp.otp = hashOtp
            existingOtp.otpExpires = otpExpires
            existingOtp.email = email
            existingUser.isVerified = false
            await existingOtp.save()
            user = await existingUser.save()
        } else {
            user = await User.create({
                name,
                email,
                password: hashPassword,
            })
            await Otp.create({
                otp: hashOtp,
                otpExpires,
                email
            })
        }
        res.status(201).json({ user, message: "User Created Successfully" })


    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.verifyUser = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!otp) {
            return res.status(400).json({ message: "OTP is required" })
        }
        const userOtp = await Otp.findOne({ email })
        const isMatch = await bcrypt.compare(otp, userOtp.otp)
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid OTP" })
        }
        const user = await User.findOne({ email })
        user.isVerified = true
        await user.save()
        await Otp.deleteOne({ email })
        res.status(200).json({ user, message: "User Verified Successfully" })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email, !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Please Signup First" })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect Password" })
        }
        const token = await jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" })
        res.status(200).json({ user, token, message: "Login Successfully" })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}




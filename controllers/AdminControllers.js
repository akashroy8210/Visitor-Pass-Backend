const validator = require("validator")
const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const { sendEmail } = require("../utils/SendEmail")
const Visitor = require("../models/visitorModel")
const Appointment = require("../models/appointmentModel")
const Logs=require("../models/logsModel")
exports.createStaff = async (req, res) => {
    try {
        const { name,email, password,role } = req.body
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email" })
        }
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({ message: "Please Enter Strong Password" })
        }
        const employe = await User.findOne({ email, role: "Employee" })
        if (employe) {
            return res.status(400).json({ message: "Employee already exists" })
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)
        const user = await User.create({
            name,
            email,
            password: hashPassword,
            role,
            isVerified:true
        })

        await sendEmail({
            to: email,
            subject: "Welcome to My Office",
            html: `
            <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Welcome to the Team</title>
</head>

<body style="margin:0; padding:0; background:#f2f4f7; font-family:'Segoe UI',Arial,sans-serif;">

  <table width="100%" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="520" style="background:#ffffff; margin:40px 0; border-radius:14px; overflow:hidden; box-shadow:0 20px 40px rgba(0,0,0,0.08);" cellpadding="0" cellspacing="0">

          <!-- Top Banner -->
          <tr>
            <td style="background:linear-gradient(135deg,#0f172a,#1e293b); padding:30px; text-align:center; color:#fff;">
              <h1 style="margin:0; font-weight:600; letter-spacing:1px;">🎉 Welcome Aboard</h1>
              <p style="margin:8px 0 0; font-size:14px; opacity:0.8;">
                Your journey with us begins today
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:35px; color:#1f2937;">
              
              <p style="font-size:16px;">Dear <b>${name}</b>,</p>

              <p style="font-size:14px; color:#4b5563; line-height:1.6;">
                Congratulations and welcome to <b>My Office</b>!  
                We are excited to have you join our team and look forward to achieving great things together.
              </p>

              <p style="font-size:14px; color:#4b5563;">
                Below are your login credentials to access the system:
              </p>

              <!-- Credentials Box -->
              <div style="
                background:#0f172a;
                color:#fff;
                padding:20px;
                border-radius:10px;
                margin:25px 0;
              ">
                <p style="margin:5px 0;"><b>Email:</b>${email}</p>
                <p style="margin:5px 0;"><b>Password:</b>${password}</p>
              </div>

              <!-- Button -->
              <div style="text-align:center; margin:30px 0;">
                <a href="https://myoffice.com" style="
                  background:linear-gradient(135deg,#2563eb,#3b82f6);
                  color:#fff;
                  padding:12px 28px;
                  border-radius:8px;
                  text-decoration:none;
                  font-size:14px;
                  font-weight:500;
                  display:inline-block;
                ">
                  Login to Your Account →
                </a>
              </div>

              <p style="font-size:13px; color:#6b7280;">
                🔐 For security reasons, we recommend changing your password after your first login.
              </p>

              <p style="font-size:14px; margin-top:25px;">
                Best regards,<br/>
                <b>My Office Team</b>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="text-align:center; padding:20px; font-size:12px; color:#9ca3af;">
              © 2026 My Office. All rights reserved.
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

        res.status(200).json({ user, message: "Staff created successfully" })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// get all staffs

exports.getStaffs=async(req,res)=>{
  try{
    const staffs=await User.find({role:{$in:["Employee","Security"]}}).sort({createdAt:-1})
    if(!staffs){
      return res.status(400).json({message:"No Staffs Found"})
    }
    res.status(200).json({staffs})
  }catch(error){
    return res.status(500).json({message:error.message})
  }
}

//get all visitors
exports.getVisitors=async(req,res)=>{
  try{
    const visitors=await User.find({role:"Visitor"}).sort({createdAt:-1})
    if(!visitors){
      return res.status(400).json({message:"No Visitors Found"})
    }
    res.status(200).json({visitors})
  }catch(error){
    return res.status(500).json({message:error.message})
  }
}

//get all appointments of visitors

exports.getVisitorsAppointments=async(req,res)=>{
  try{
    const appointemnt=await Appointment.find().sort({createdAt:-1})
    if(!appointemnt){
      return res.status(400).json({message:"No Appointment Found"})
    }
    res.status(200).json({appointemnt})
  }catch(error){
    res.status(500).json({message:error.message})
  }
}


exports.getAllLogs=async(req,res)=>{
  try{
    const logs=await Logs.find()
    if(logs.length===0){
      return res.status(400).json({message:"No Logs Found"})
    }
    res.status(200).json({logs})
  }catch(error){
    res.status(500).json({message:error.message})
  }
}

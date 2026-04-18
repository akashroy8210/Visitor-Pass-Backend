const User = require("../models/userModel")
const Visitor = require("../models/visitorModel")
const Appointment = require("../models/AppointmentModel")
const { sendEmail } = require("../utils/SendEmail")
const Pass = require("../models/passModel")
const fs = require("fs")
const { uploadPDF } = require("../utils/uploadPdf")
const { generatePDF } = require("../utils/createPdf")
const { generateQR } = require("../utils/generateQR")
exports.getAllAppointments = async (req, res) => {
  try {
    const employee = await User.findById(req.user._id)
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" })
    }
    const appointemnt = await Appointment.find({ employeeId: employee._id })
      .populate("visitorId", "name email")
      .sort({ createdAt: -1 })
    if (appointemnt.length === 0) {
      return res.status(400).json({ message: "No Appointment Found" })
    }
    res.status(200).json({
      appointemnt
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
exports.createAppointmentResponse = async (req, res) => {
  try {
    const { status, appointmentId } = req.body
    const pass = await Pass.find({ appointmentId: appointmentId })
    //check is pass expired if yes then generate other one 
    if (pass.length > 0 && new Date() < pass[0].validTo) {
      return res.status(400).json({ message: "Pass Already Created" })
    }
    if (pass.length > 0) {
      return res.status(400).json({ message: "Pass Already Created" })
    }
    const appointment = await Appointment.findById(appointmentId)
    if (!appointment) {
      return res.status(400).json({ message: "No Appointment Found" })
    }
    const employee = await User.findById(appointment.employeeId)
    console.log(employee._id)
    // findint the visitor of the appointment
    const visitor = await User.findById(appointment.visitorId)
    console.log(visitor._id)
    console.log(visitor.email)
    if (!visitor || !employee) {
      return res.status(400).json({ message: "Visitor or Employee Not Found" })
    }

    //if appointment is approved then create the pass and send email to visitor
    if (status === "approved") {
      const validFrom= new Date(appointment.date)
      const  validTo= new Date(new Date(appointment.date).getTime() + (60 * 60 * 1000))

      // creating the pass
      const pass = await Pass.create({
        visitorId: appointment.visitorId,
        appointmentId: appointment._id,
        employeeId: appointment.employeeId,
        validTo: validTo,
        validFrom: validFrom,
      })
      //generate qr image and storing appointmnet id
      const qrImage = await generateQR(pass._id)
      // creating the data for pdf
      const data = {
        status: status,
        name: visitor.name,
        email: visitor.email,
        employeeName: employee.name,
        validFrom:validFrom,
        validTo:validTo,
        qrImage: qrImage
      }
      // creating the pdf
      const pdfBuffer = await generatePDF(data)
      console.log("pdf length", pdfBuffer.length)
      
      const pdfUrl = await uploadPDF(pdfBuffer)
       pass.pdfUrl = pdfUrl
       await pass.save()
      
      await sendEmail({
        to: visitor.email,
        subject: "Your Appointment is Approved",
        html: `
                <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0f172a;
      font-family: Arial, sans-serif;
    }

    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #111827;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
    }

    .header {
      background: linear-gradient(135deg, #6366f1, #22c55e);
      color: white;
      text-align: center;
      padding: 25px;
    }

    .header h2 {
      margin: 0;
    }

    .content {
      padding: 25px;
      color: #e5e7eb;
    }

    .status {
      text-align: center;
      padding: 12px;
      margin: 20px 0;
      border-radius: 8px;
      font-weight: bold;
      font-size: 16px;
    }

    .approved {
      background: rgba(34,197,94,0.1);
      color: #22c55e;
      border: 1px solid #22c55e;
    }

    .rejected {
      background: rgba(239,68,68,0.1);
      color: #ef4444;
      border: 1px solid #ef4444;
    }

    .card {
      background: #1f2937;
      padding: 15px;
      border-radius: 10px;
      margin-top: 15px;
    }

    .card p {
      margin: 8px 0;
      font-size: 14px;
    }

    .highlight {
      color: #ffffff;
      font-weight: 500;
    }

    .button {
      display: block;
      width: fit-content;
      margin: 25px auto 0;
      padding: 12px 20px;
      background: linear-gradient(135deg, #6366f1, #22c55e);
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: bold;
    }

    .footer {
      text-align: center;
      padding: 15px;
      font-size: 12px;
      color: #9ca3af;
      border-top: 1px solid #1f2937;
    }
  </style>
</head>

<body>

<div class="container">

  <div class="header">
    <h2>My Office</h2>
    <p>Visitor Management System</p>
  </div>

  <div class="content">

    <p>Hello <span class="highlight">${visitor.name}</span>,</p>

    <p>Your appointment request has been processed.</p>

    <div class="status ${status}">
      ${status}
    </div>

    <div class="card">
      <p><strong>Date:</strong> <span class="highlight">${new Date().toLocaleDateString("en-US")}</span></p>
      <p><strong>Valid From:</strong> <span class="highlight">${validFrom}</span></p>
      <p><strong>Valid To:</strong> <span class="highlight">${validTo}</span></p>
      <p><strong>Approved By:</strong> <span class="highlight">${employee.name}</span></p>
    </div>

    <!-- Show only if approved -->
    <a href="${pdfUrl}" class="button">Download Pass</a>

    <p style="margin-top:20px; font-size:13px; color:#9ca3af;">
      Please carry your pass (QR code) during your visit.
    </p>

  </div>

  <div class="footer">
    © 2026 My Office
  </div>

</div>

</body>
</html>
                `
      })
      console.log("pass created successfully")
      // giving the response of the appointment 
      await Appointment.findByIdAndUpdate(appointmentId, { status })
      res.status(200).json({
        message: "Appointment get Approved Successfully",
        appointment,
      })
      console.log("Email sent Successfully");
    }
    //if appointment get rejected email will be shared to visitor
    if (status === "rejected") {
      await sendEmail({
        to: visitor.email,
        subject: "Your Appointment is Rejected",
        html: `
                <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0f172a;
      font-family: Arial, sans-serif;
    }

    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #111827;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
    }

    .header {
      background: linear-gradient(135deg, #6366f1, #ef4444);
      color: white;
      text-align: center;
      padding: 25px;
    }

    .header h2 {
      margin: 0;
    }

    .content {
      padding: 25px;
      color: #e5e7eb;
    }

    .status {
      text-align: center;
      padding: 12px;
      margin: 20px 0;
      border-radius: 8px;
      font-weight: bold;
      font-size: 16px;
    }

    .rejected {
      background: rgba(239,68,68,0.1);
      color: #ef4444;
      border: 1px solid #ef4444;
      text-transform: capitalize;
    }

    .card {
      background: #1f2937;
      padding: 15px;
      border-radius: 10px;
      margin-top: 15px;
    }

    .card p {
      margin: 8px 0;
      font-size: 14px;
    }

    .highlight {
      color: #ffffff;
      font-weight: 500;
    }

    .footer {
      text-align: center;
      padding: 15px;
      font-size: 12px;
      color: #9ca3af;
      border-top: 1px solid #1f2937;
    }
  </style>
</head>

<body>

<div class="container">

  <div class="header">
    <h2>My Office</h2>
    <p>Visitor Management System</p>
  </div>

  <div class="content">

    <p>Hello <span class="highlight">${visitor.name}</span>,</p>

    <p>We regret to inform you that your appointment request has been processed.</p>

    <div class="status rejected">
      ${status}
    </div>

    <div class="card">
      <p><strong>Date:</strong> <span class="highlight">${appointment.date ? new Date(appointment.date).toDateString() : new Date().toDateString()}</span></p>
      <p><strong>Requested With:</strong> <span class="highlight">${employee.name}</span></p>
      <p><strong>Status:</strong> <span class="highlight">Rejected</span></p>
    </div>

    <p style="margin-top:20px; font-size:13px; color:#9ca3af;">
      Please contact the office if you need more details or would like to request another appointment.
    </p>

  </div>

  <div class="footer">
    © 2026 My Office
  </div>

</div>

</body>
</html>
                `
      })
      await Appointment.findByIdAndUpdate(appointmentId, { status })
      console.log("Rejection email sent Successfully");
      res.status(200).json({
        message: "Appointment get Rejected Successfully",
        appointment,
      })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


exports.getSchedule = async (req, res) => {
  try {
    const scheduleds = await Pass.find({ employeeId: req.user._id }).populate("visitorId", "name email").populate("appointmentId", "date message").sort({ createdAt: -1 })
    if (scheduleds.length === 0) {
      return res.status(400).json({ message: "No Schedule Found" })
    }
    res.status(200).json({ scheduleds })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

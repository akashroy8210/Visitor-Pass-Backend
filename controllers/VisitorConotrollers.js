const validator=require("validator")
const User=require("../models/userModel")
const Visitor=require("../models/visitorModel")
const Appointment=require("../models/AppointmentModel")
const Logs=require("../models/logsModel")
const Pass = require("../models/passModel")
exports.createAppointment=async(req,res)=>{
    try{
        const {visitorId,employeeId,date,message}=req.body
        if(!visitorId || !employeeId || !date || !message){
            return res.status(400).json({message:"All Fields are Required"})
        }
        const existingAppointment=await Appointment.findOne({visitorId:visitorId,employeeId:employeeId})

        //we now check that is the appointment is approved or not if yes then check is it expired or not if not then check from pass is check in or not
        if(existingAppointment && existingAppointment.status==="approved" && new Date(existingAppointment.date)>new Date()){
            return res.status(400).json({message:"You Already Have an Appointment"})
        }
        const visitor=await User.findById(visitorId)
        if(!visitor){
            return res.status(400).json({message:"Please Signup First"})
        }
        const employeeUser=await User.findById(employeeId)
        if(!employeeUser){
            return res.status(400).json({message:"Employee Not Found"})
        }
        const appointment=await Appointment.create({visitorId,employeeId,date,message,status:"pending"})
        res.status(200).json({appointment,message:`Appointment is Created Successfully to ${employeeUser.name}`,})
    }catch(error){
        return res.status(500).json({message:error.message})
    }
}


exports.getAllAppointments=async(req,res)=>{
    try{
        const visitor=await User.findById(req.user._id)
        if(!visitor){
            return res.status(400).json({message:"Please Signup First"})
        }
        const appointemnt=await Appointment.find({
            visitorId:visitor._id
        }).sort({createdAt:-1}).populate("employeeId","name email")
        if(appointemnt.length===0){
            return res.status(200).json({appointemnt:[], pass:[]})
        }

        const appointmentIds = appointemnt.map((appointment) => appointment._id)
        const pass = await Pass.find({
            appointmentId: { $in: appointmentIds }
        }).select("appointmentId pdfUrl validFrom validTo qrCode")

        res.status(200).json({appointemnt,pass})
    }catch(error){
        return res.status(500).json({message:error.message})
    }
}

exports.getlogsByVisitor=async(req,res)=>{
    try{
        const visitor=await User.findById(req.user._id)
        if(!visitor){
            return res.status(400).json({message:"Please Signup First"})
        }
        const logs=await Logs.find({visitorId:visitor._id}).sort({createdAt:-1}).populate("visitorId","name email")
        res.status(200).json({logs})
    }catch(error){
        res.status(500).json({message:error.message})
    }
}

exports.getAvailableEmployees=async(req,res)=>{
    try{
        const employees=await User.find({role:"Employee"})
        if(employees.length===0){
            return res.status(400).json({message:"No Employee Found"})
        }
        res.status(200).json({employees})
    }catch(err){
        res.status(500).json({message:err.message})
    }
}

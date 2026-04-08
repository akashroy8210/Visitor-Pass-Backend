const validator=require("validator")
const User=require("../models/userModel")
const Visitor=require("../models/visitorModel")
const Appointment=require("../models/appointmentModel")
const Logs=require("../models/logsModel")
exports.createAppointment=async(req,res)=>{
    try{
        const {visitorId,employeeId,date,status}=req.body
        const existingAppointment=await Appointment.findOne({visitorId:visitorId,employeeId:employeeId})
        if(existingAppointment){
            return res.status(400).json({message:"You Already Have an Appointment"})
        }
        const visitor=await User.findById(visitorId)
        if(!visitor){
            return res.status(400).json({message:"Please Signup First"})
        }
        const employeeUser=await User.findById(employeeId)
        const appointment=await Appointment.create({visitorId,employeeId,date,status})
        res.status(200).json({appointment,message:`Appointment is Created Successfully to ${employeeUser.name}`,})
    }catch(error){
        return res.status(500).json({message:error.message})
    }
}


exports.getAllAppointments=async(req,res)=>{
    try{
        const {id}=req.body
        const visitor=await User.findById(id)
        if(!visitor){
            return res.status(400).json({message:"Please Signup First"})
        }
        console.log(visitor._id)
        const appointemnt=await Appointment.find({
            visitorId:visitor._id
        }).sort({createdAt:-1})
        if(appointemnt.length===0){
            return res.status(400).json({message:"No Appointment Found"})
        }
        res.status(200).json({appointemnt})
    }catch(error){
        return res.status(500).json({message:error.message})
    }
}

exports.getlogsByVisitor=async(req,res)=>{
    try{
        const {id}=req.params
        const logs=await Logs.find({visitorId:id}).sort({createdAt:-1})
        if(!logs){
            return res.status(400).json({message:"No Logs Found"})
        }
        res.status(200).json({logs})
    }catch(error){
        return res.status(500).json({message:error.message})
    }
}
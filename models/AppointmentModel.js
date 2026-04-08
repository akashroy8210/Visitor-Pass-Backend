const mongoose=require("mongoose")

const appointmentSchema=mongoose.Schema({
    visitorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    employeeId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    date:{type:Date},
    status:{
        type:String,
        enum:["pending","approved","rejected"],
        default:"pending"
    }
},{timeStamps:true})

module.exports=mongoose.model("Appointment",appointmentSchema)
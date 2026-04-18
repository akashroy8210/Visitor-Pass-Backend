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
    message:{
        type:String,
        required:true
    },
    date:{type:Date},
    status:{
        type:String,
        enum:["pending","approved","rejected"],
        default:"pending"
    }
},{timestamps:true})

module.exports=mongoose.model("Appointment",appointmentSchema)
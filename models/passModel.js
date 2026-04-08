const mongoose=require("mongoose")

const passSchema=mongoose.Schema({
    visitorId :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Visitor",
        required:true
    },
    appointmentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Appointment",
        required:true
    },
    employeeId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    validFrom:{
        type:Date,
    },
    validTo:{
        type:Date,
    },
    pdfUrl:{
        type:String,
    },
    qrCode:{
        type:String,
    },
    isUsed:{
        type:Boolean,
        default:false
    }

} ,{timestamps:true})


module.exports=mongoose.model("Pass",passSchema)
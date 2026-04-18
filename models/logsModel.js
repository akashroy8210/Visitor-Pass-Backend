const mongoose=require("mongoose")

const logsSchema=mongoose.Schema({
    passId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Pass",
        required:true
    },
    visitorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    checkInTime:{
        type:Date,
    },
    checkOutTime:{
        type:Date,
    },
    status:{
        type:String,
        enum:["checked-in","checked-out"]
    }
},{timeStamps:true})

module.exports=mongoose.model("Logs",logsSchema)
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
    status:{
        type:String,
        enum:["checked-in","checked-out"],
        default:"checked-in"
    }
},{timeStamps:true})

module.exports=mongoose.model("Logs",logsSchema)
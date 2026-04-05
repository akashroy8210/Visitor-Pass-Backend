const mongoose=require("mongoose")

const otpSchema=mongoose.Schema({
    otp:{
        type:String,
        required:true
    },
    otpExpires:{
        type:Date
    },
    email:{
        type:String,
        required:true,
    }
},{timestamps:true})

module.exports=mongoose.model("Otp",otpSchema)
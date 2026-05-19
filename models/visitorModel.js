const mongoose=require("mongoose")

const visitorSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    image:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    }
},{timestamps:true})

module.exports=mongoose.model("Visitor",visitorSchema)
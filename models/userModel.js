const mongoose=require("mongoose")

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    role:{
        type:String,
        enum:["Employee","Admin","Security","Visitor"],
        default:"Visitor"
    }
},{timestamps:true})

module.exports=mongoose.model("User",userSchema)

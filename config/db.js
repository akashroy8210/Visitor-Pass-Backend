const mongoose=require("mongoose")

const connectionDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Database is Connected")
    }catch(err){
        console.log(err,"Database not Connected Successfully")
    }
}

module.exports=connectionDB
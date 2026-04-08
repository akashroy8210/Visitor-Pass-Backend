const Logs=require("../models/logsModel")
const Pass=require("../models/passModel")
exports.scanQrCode=async(req,res)=>{
    try{
        const {id}=req.params
        const pass=await Pass.findById(id).populate("visitorId").populate("appointmentId")
        if(!pass){
            return res.status(400).json({message:"No Pass Found"})
        }
        if(new Date()>pass.validTo){
            return res.status(400).json({message:"Pass Expired"})
        }
        const existingLog=await Logs.findOne({passId:id})
        if(existingLog.status==="checked-out"){
            return res.status(400).json({message:"Pass Already Used"})
        }
        if(!existingLog){
            await Logs.create({
                passId:id,
                visitorId:pass.visitorId._id,
                checkInTime:new Date()
            })
            return res.status(200).json({message:"check-in successfully",existingLog,pass})
        }
        if(existingLog.status==="checked-in"){
            existingLog.checkOutTime=new Date()
            existingLog.status="checked-out"
            await existingLog.save()

            return res.status(200).json({message:"check-out successfully",existingLog,pass})
        }

    }catch(error){
        return res.status(500).json({message:error.message})
    }
}

exports.getLogs=async (req,res)=>{
    try{
        const logs=await Logs.find().populate("visitorId").populate("passId")
        if(!logs){
            return res.status(400).json({message:"No Logs Found"})
        }
        res.status(200).json({logs,message:"Logs Fetched Successfully"})
    }catch(error){
        return res.status(500).json({message:error.message})
    }
}
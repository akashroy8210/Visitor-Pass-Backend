const QRcode=require("qrcode")

exports.generateQR=async(passId,visitorId,employeeId)=>{
    const qrData= JSON.stringify({passId,visitorId,employeeId})
    const qrImage=await QRcode.toDataURL(qrData)
    return qrImage
}

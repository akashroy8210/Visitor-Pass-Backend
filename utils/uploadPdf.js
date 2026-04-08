const cloudinary = require("./cloudinary")

exports.uploadPDF = async (buffer) => {
    return new Promise((resolve, reject) => {
        console.log("uploading PDF....")
        const stream = cloudinary.uploader.upload_stream({
            resource_type: "image",
            format: "pdf",
            type: "upload",
            folder: "visitor_passes"
        },
            (error, result) => {
                if (error) {
                    console.log("cloudinary error", error)
                    return reject(error)
                }
                console.log("uploaded", result.secure_url)
                resolve(result.secure_url)
            }
        )
        stream.end(buffer)
    })
}

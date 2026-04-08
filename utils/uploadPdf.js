const cloudinary = require("./cloudinary")

exports.uploadPDF = async (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({
            resource_type: "raw",
            folder: "visitor_passes"
        },
            (error, result) => {
                if (error) {
                    return reject(error)
                }
                resolve(result.secure_url)
            }

        )
        stream.end(buffer)
    })
}

const PDFDocument = require("pdfkit")

exports.generatePDF = (data) => {
  return new Promise((resolve, reject) => {

    const doc = new PDFDocument({ size: "A4", margin: 50 })
    const buffers = []
    doc.on("data", buffers.push.bind(buffers))
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers)
      resolve(pdfData)
    })

    // 🎨 HEADER
    doc
      .fontSize(20)
      .fillColor("black")
      .text("My Office", { align: "center" })

    doc.moveDown()

    // STATUS
    doc
      .fontSize(16)
      .fillColor(data.status === "approved" ? "green" : "red")
      .text(
        `STATUS: ${data.status.toUpperCase()}`,
        { align: "center" }
      )

    doc.moveDown(2)

    // VISITOR INFO
    doc.fillColor("black").fontSize(12)
    doc.text(`Name: ${data.name}`)
    doc.text(`Email: ${data.email}`)

    doc.moveDown()

    // APPOINTMENT INFO
    doc.text(`Date: ${new Date().toDateString()}`)
    doc.text(`Valid From: ${data.validFrom}`)
    doc.text(`Valid To: ${data.validTo}`)

    doc.moveDown()

    // EMPLOYEE
    doc.text(`Handled By: ${data.employeeName}`)

    doc.moveDown()

    // REJECTION MESSAGE
    if (data.status === "rejected") {
      doc
        .fillColor("red")
        .text(`Reason: ${data.message || "Not specified"}`)
    }

    // QR CODE (only if approved)
    if (data.status === "approved" && data.qrImage) {
      doc.moveDown()
      try {
        const qrBuffer = Buffer.from(
          data.qrImage.split(",")[1],
          "base64"
        )
        doc.image(qrBuffer, {
          fit: [150, 150],
          align: "center"
        })
      }catch(error){
        console.log(error)
      }
    }

    // FOOTER
    doc.moveDown(2)
    doc
      .fontSize(10)
      .fillColor("gray")
      .text("This is a system generated pass", { align: "center" })

    doc.end()

  })
}

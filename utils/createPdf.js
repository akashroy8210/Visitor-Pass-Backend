const PDFDocument = require("pdfkit")
const fs = require("fs")

exports.generatePDF = (data) => {
  return new Promise((resolve,reject) => {

    const doc = new PDFDocument({ size: "A4", margin: 50 })
    const buffers = []
    doc.on("data",buffers.push.bind(buffers))
    doc.on("end",()=>{
      const pdfData=Buffer.concat(buffers)
      resolve(pdfData)
    })

    // 🎨 HEADER
    doc
      .fontSize(20)
      .fillColor("#333")
      .text("My Office", { align: "center" })

    doc.moveDown()

    // STATUS
    doc
      .fontSize(16)
      .fillColor(data.status === "approved" ? "green" : "red")
      .text(
        `STATUS: ${data.status.toUpperCase()} ${
          data.status === "approved" ? "✅" : "❌"
        }`,
        { align: "center" }
      )

    doc.moveDown(2)

    // VISITOR INFO
    doc.fillColor("#000").fontSize(12)
    doc.text(`Name: ${data.name}`)
    doc.text(`Email: ${data.email}`)

    doc.moveDown()

    // APPOINTMENT INFO
    doc.text(`Date: ${data.date}`)
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
      doc.image(data.qrImage, {
        fit: [150, 150],
        align: "center"
      })
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

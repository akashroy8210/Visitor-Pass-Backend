const express=require("express")
const { getAllAppointments, createAppointment } = require("../controllers/VisitorConotrollers")
const router=express.Router()

router.post('/createAppointment',createAppointment)
router.get('/allAppointments',getAllAppointments)

module.exports=router
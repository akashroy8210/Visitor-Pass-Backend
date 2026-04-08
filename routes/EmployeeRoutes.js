const express=require("express")
const { getAllAppointments, createAppointmentResponse } = require("../controllers/EmployeeControllers")
const router=express.Router()

//appointments will be specific for each employee
router.get('/appointments/:id',getAllAppointments)
router.post('/appoitments/response',createAppointmentResponse)
module.exports=router
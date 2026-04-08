const express=require("express")
const { getAllAppointments, createAppointmentResponse } = require("../controllers/EmployeeControllers")
const { authMiddleware } = require("../middleware/AdminMiddleware")
const { allowRoles } = require("../middleware/RoleMiddleware")
const router=express.Router()

//appointments will be specific for each employee
router.get('/appointments/:id',authMiddleware,allowRoles("Employee"),getAllAppointments)
router.post('/appoitments/response',authMiddleware,allowRoles("Employee"),createAppointmentResponse)
module.exports=router
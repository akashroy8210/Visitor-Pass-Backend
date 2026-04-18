const express=require("express")
const { getAllAppointments, createAppointmentResponse } = require("../controllers/EmployeeControllers")
const { authMiddleware } = require("../middleware/AdminMiddleware")
const { allowRoles } = require("../middleware/RoleMiddleware")
const {getSchedule}=require("../controllers/EmployeeControllers")
const router=express.Router()

//appointments will be specific for each employee
router.get('/allAppointments',authMiddleware,allowRoles("Employee"),getAllAppointments)
router.post('/appoitments/response',authMiddleware,allowRoles("Employee"),createAppointmentResponse)
router.get('/schedule',authMiddleware,allowRoles("Employee"),getSchedule)
module.exports=router
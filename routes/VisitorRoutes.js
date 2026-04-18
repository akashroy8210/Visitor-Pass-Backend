const express=require("express")
const { getAllAppointments, createAppointment ,getlogsByVisitor, getAvailableEmployees} = require("../controllers/VisitorConotrollers")
const { authMiddleware } = require("../middleware/AdminMiddleware")
 const {allowRoles} = require("../middleware/RoleMiddleware")
const router=express.Router()

router.get('/employees',authMiddleware,allowRoles("Visitor"),getAvailableEmployees)
router.post('/createAppointment',authMiddleware,allowRoles("Visitor"),createAppointment)
router.get('/allAppointments',authMiddleware,allowRoles("Visitor"),getAllAppointments)
router.get('/logs',authMiddleware,allowRoles("Visitor"),getlogsByVisitor)
module.exports=router

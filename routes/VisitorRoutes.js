const express=require("express")
const { getAllAppointments, createAppointment ,getlogsByVisitor} = require("../controllers/VisitorConotrollers")
const { authMiddleware } = require("../middleware/AdminMiddleware")
 const {allowRoles} = require("../middleware/RoleMiddleware")
const router=express.Router()

router.post('/createAppointment',authMiddleware,allowRoles("Visitor"),createAppointment)
router.get('/allAppointments',authMiddleware,allowRoles("Visitor"),getAllAppointments)
router.get('/logs/:id',authMiddleware,allowRoles("Visitor"),getlogsByVisitor)
module.exports=router
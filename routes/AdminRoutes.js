const express=require("express")
const {createStaff, getStaffs, getVisitors, getAllLogs, removeStaff}=require("../controllers/AdminControllers")
const {authMiddleware}=require("../middleware/AdminMiddleware")
const {allowRoles}=require("../middleware/RoleMiddleware")
const router=express.Router()

router.post('/addStaff',authMiddleware,allowRoles("Admin"), createStaff)
router.get('/allStaff',authMiddleware,allowRoles("Admin"),getStaffs)
router.get('/allVisitors',authMiddleware,allowRoles("Admin"),getVisitors)
router.get('/logs',authMiddleware,allowRoles("Admin"),getAllLogs)
router.delete('/removeStaff/:id',authMiddleware,allowRoles("Admin"),removeStaff)
module.exports=router

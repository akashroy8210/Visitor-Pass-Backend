const express=require("express")
const {createStaff, getStaffs, getVisitors}=require("../controllers/AdminControllers")
const {adminMiddleware}=require("../middleware/AdminMiddleware")
const {allowRoles}=require("../middleware/RoleMiddleware")
const router=express.Router()

router.post('/addStaff',adminMiddleware,allowRoles("Admin"), createStaff)
router.get('/allStaff',adminMiddleware,getStaffs)
router.get('/allVisitors',getVisitors)
module.exports=router

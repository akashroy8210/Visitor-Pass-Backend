const express=require("express")
const {createStaff}=require("../controllers/AdminControllers")
const {adminMiddleware}=require("../middleware/AdminMiddleware")
const {allowRoles}=require("../middleware/RoleMiddleware")
const router=express.Router()

router.post('/addStaff',adminMiddleware,allowRoles("Admin"), createStaff)

module.exports=router

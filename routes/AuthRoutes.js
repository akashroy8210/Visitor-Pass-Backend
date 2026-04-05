const express=require("express")
const {signupUser,verifyUser,loginUser}=require("../controllers/AuthControllers")
const router=express.Router()
router.post('/signup',signupUser)
router.post('/signup/verify-otp',verifyUser)
router.post('/login',loginUser)

module.exports=router
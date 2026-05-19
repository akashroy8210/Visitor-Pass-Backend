const express=require("express")
const {signupUser,verifyUser,loginUser}=require("../controllers/AuthControllers")
const router=express.Router()
router.post('/signup',upload.single("image"),signupUser)
router.post('/signup/verify-otp',verifyUser)
router.post('/login',loginUser)
router.post('/login/forgetPass',forgetPassword)
router.post('/login/findUser',findUser)
module.exports=router

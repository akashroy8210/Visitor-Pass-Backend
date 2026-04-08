const express=require("express")
const { scanQrCode, getLogs } = require("../controllers/SecurityControllers")
const { authMiddleware } = require("../middleware/AdminMiddleware")
const { allowRoles } = require("../middleware/RoleMiddleware")
const router=express.Router()
router.post('/scanQr/:id',authMiddleware,allowRoles("Security"),scanQrCode)
router.get('/logs',authMiddleware,allowRoles("Security"),getLogs)

module.exports=router
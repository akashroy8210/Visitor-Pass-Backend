const express=require("express")
const dotenv=require("dotenv")
const connectionDB =require("./config/db")
const AuthRoutes=require('./routes/AuthRoutes')
const AdminRoutes=require("./routes/AdminRoutes")
dotenv.config()
const server=express()
server.use(express.json())
connectionDB()
server.get('/',(req,res)=>{
    res.send("Hello From the Backend Server and Buddy")
})
server.use('/api/users',AuthRoutes)
server.use('/api/admin',AdminRoutes)

const PORT=process.env.PORT || 8080

server.listen(PORT,()=>{
    console.log(`server is running on http://localhost:${PORT}`)
})
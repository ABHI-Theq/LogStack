import express, { urlencoded } from "express"
import cors from "cors"
import dotenv from "dotenv"
import DBConnect from "./utils/DBConnect"
import UserRoute from "./routes/user.route"
import {v2 as cloudinary} from "cloudinary"
dotenv.config()
DBConnect()

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
})

const app=express()
app.use(express.json())
app.use(urlencoded({extended:true}))
app.use(cors())
app.use("/api/auth",UserRoute)
app.listen(process.env.PORT,()=>{
    console.log(`Server is running on http://localhost:${process.env.PORT}`);  
})
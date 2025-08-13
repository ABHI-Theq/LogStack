import express, { urlencoded } from "express"
import dotenv from "dotenv"
import blogRoutes from "./routes/blog.routes"
import {Redis} from "@upstash/redis"
dotenv.config()

const app=express()

export const redis=new Redis({
    url:process.env.REDIS_URL,
    token:process.env.REDIS_TOKEN
})

app.use(express.json())
app.use(urlencoded({extended:true}))

app.use("/api/v1",blogRoutes)

app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`)
})
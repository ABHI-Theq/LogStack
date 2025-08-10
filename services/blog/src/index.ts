import express, { urlencoded } from "express"
import dotenv from "dotenv"
import blogRoutes from "./routes/blog.routes"
dotenv.config()

const app=express()

app.use(express.json())
app.use(urlencoded({extended:true}))

app.use("/api/v1",blogRoutes)

app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`)
})
import express, { urlencoded } from "express"
import dotenv from "dotenv"
import { sql } from "./utils/DBConnect"
import blogrouter from "./routes/blog.route"
import {v2 as cloudinary} from "cloudinary"
import { connectRabbitMQ } from "./utils/rabbitmq"
dotenv.config()

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
})

connectRabbitMQ()


const app=express()


async function initDB(){
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS blogs(
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description VARCHAR(255) NOT NULL,
            blogcontent TEXT NOT NULL,
            image VARCHAR(255) NOT NULL,
            category VARCHAR(255) NOT NULL,
            author VARCHAR(255) NOT NULL,
            create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`

        await sql`
            CREATE TABLE IF NOT EXISTS comments(
            id SERIAL PRIMARY KEY,
            comment VARCHAR(255) NOT NULL,
            userid VARCHAR(255) NOT NULL,
            username VARCHAR(255) NOT NULL,
            blogid VARCHAR(255) NOT NULL,
            create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`

        await sql`
            CREATE TABLE IF NOT EXISTS savedblogs(
            id SERIAL PRIMARY KEY,
            userid VARCHAR(255) NOT NULL,
            blogid VARCHAR(255) NOT NULL,
            create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`

        console.log("database intialized")
    } catch (error) {
        console.error("Error: ",error)
    }
}

app.use(express.json())
app.use(urlencoded({extended:true}))

app.use("/api/v1",blogrouter) 

initDB().then(()=>{
    app.listen(process.env.PORT,()=>{
    console.log(`Server is running at http://localhost:4001`)
})
})
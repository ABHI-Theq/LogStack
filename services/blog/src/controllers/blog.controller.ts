import { Request, Response } from "express";
import { sql } from "../utils/DBConnect";
import axios from "axios"
import { redis } from "..";

export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const { searchQuery="", category="" } = req.body;

    const cacheKey=`blogs:${searchQuery}:${category}`

    const cachedBlogs=await redis.get(cacheKey)

    if(cachedBlogs){
      console.log("serving from Redis cache");
      
      return res.status(200).json({blogs:JSON.parse(cachedBlogs as string)})
    }

    let blogs;
    if (searchQuery && category) {
      blogs = await sql`SELECT * FROM blogs WHERE (title ILIKE ${
        "%" + searchQuery + "%"
      } OR description ILIKE ${"%" + searchQuery + "%"}) AND 
            category=${category} ORDER BY create_at DESC`;
    } else if (searchQuery) {
      blogs = await sql`SELECT * FROM blogs WHERE (title ILIKE ${
        "%" + searchQuery + "%"
      } OR description 
            ILIKE ${"%" + searchQuery + "%"}) ORDER BY create_at DESC`;
    }else if(category){
      blogs = await sql`SELECT * FROM blogs WHERE category=${category} ORDER BY create_at DESC`;
    }
     else {
      blogs = await sql`SELECT * FROM blogs ORDER BY create_at DESC;`;
    }

    console.log("serving from DB");
    await redis.set(cacheKey,JSON.stringify(blogs),{
      ex: 3600
    })
    
    return res
      .status(200)
      .json({ message: "blogs fetched successfully", blogs });
  } catch (error) {
    return res
      .status(400)
      .json({
        error:
          error instanceof Error
            ? error.message
            : "Error occured while feteching blogs",
      });
  }
};

export const getSingleBlog=async(req:Request,res:Response)=>{
    try {
        const {id}=req.params;

        const cacheKey=`blogs:${id}`
        const cachedBlog=await redis.get(cacheKey);

        if(cachedBlog){
          console.log("serving single blog from redis cache");
          return res.status(200).json({blog:JSON.parse(cachedBlog as string)})
        }

        const blog=await sql`SELECT * FROM blogs WHERE id=${id};`
        if(!blog[0]){
            return res.status(404).json({message:"Blog not found"})
        }
        const {data}=await axios.get(`${process.env.USER_SERVICE}/api/v1/user/${blog[0].author}`)

        const responseData={blog:blog[0],author:data}

        await redis.set(cacheKey,JSON.stringify(responseData))
        console.log("serving single blog from DB");

        return res.status(200).json({message:"Blog fetched successfully",blog:blog[0],author:data})
    } catch (error) {
        return res.status(400).json({error:error instanceof Error?error.message:"Error occured"})
    }
}

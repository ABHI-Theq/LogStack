import { Request, Response } from "express";
import { sql } from "../utils/DBConnect";
import axios from "axios"

export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const { searchQuery, category } = req.body;

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
    } else {
      blogs = await sql`SELECT * FROM blogs ORDER BY create_at DESC;`;
    }

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
        const blog=await sql`SELECT * FROM blogs WHERE id=${id};`
        if(!blog[0]){
            return res.status(404).json({message:"Blog not found"})
        }
        const {data}=await axios.get(`${process.env.USER_SERVICE}/api/v1/user/${blog[0].author}`)

        return res.status(200).json({message:"Blog fetched successfully",blog:blog[0],author:data})
    } catch (error) {
        return res.status(400).json({error:error instanceof Error?error.message:"Error occured"})
    }
}

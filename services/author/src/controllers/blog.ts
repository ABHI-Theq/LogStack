import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/isAuth";
import getBuffer from "../utils/datauri";
import { v2 as cloudinary } from "cloudinary";
import { sql } from "../utils/DBConnect";

export const createBlog = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, description, blogcontent, category } = req.body;

    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "file not foundt" });
    }
    const fileBuffer = getBuffer(file);
    if (!fileBuffer) {
      return res.status(400).json({ error: "Failed to generate file buffer" });
    }
    const cloud = await cloudinary.uploader.upload(
      fileBuffer.content as string,
      {
        folder: "blogs",
      }
    );

    const result = await sql`
    INSERT INTO blogs (title,description,image,blogcontent,category,author) VALUES (${title},${description}
    ,${cloud.secure_url},${blogcontent},${category},${req.user?._id}) RETURNING *;`;

    return res
      .status(201)
      .json({ message: "Blog created successfully", blog: result[0] });
  } catch (error) {
    return res.status(500).json({error:error instanceof Error?error.message:"Error occured"})
  }
};

export const updateBlog = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, blogcontent, category } = req.body;

    const file = req.file;

    const blogs = await sql`SELECT * FROM blogs WHERE id=${id}`;
    if (blogs.length == 0) {
      return res.status(404).json({ error: "Blog not found" });
    }
    if (blogs[0].author !== req.user?._id) {
      return res.status(403).json({ error: "You are not author of this blog" });
    }
    let imgUrl = blogs[0].image;

    if (file) {
      const fileBuffer = getBuffer(file);
      if (!fileBuffer || !fileBuffer.content) {
        return res
          .status(400)
          .json({ error: "Failed to generate file buffer" });
      }
      const cloud = await cloudinary.uploader.upload(
        fileBuffer.content as string,
        {
          folder: "blogs",
        }
      );

      imgUrl = cloud.secure_url;
    }

    const updatedBlog = await sql`UPDATE blogs SET 
  title = ${title || blogs[0].title},
  description = ${description || blogs[0].description},
  image= ${imgUrl},
  blogcontent = ${blogcontent || blogs[0].blogcontent},
  category = ${category || blogs[0].category}

  WHERE id = ${id}
  RETURNING *
  `;

    return res.status(200).json({
      message: "blog updated successfully",
      updatedBlog,
    });
  } catch (error) {
        return res.status(500).json({error:error instanceof Error?error.message:"Error occured"})
  }
};

export const deleteBlog = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const blog = await sql`SELECT * FROM blogs WHERE id = ${req.params.id}`;

    if (!blog.length) {
      res.status(404).json({
        message: "No blog with this id",
      });
      return;
    }

    if (blog[0].author !== req.user?._id) {
      res.status(401).json({
        message: "You are not author of this blog",
      });
      return;
    }

    await sql`DELETE FROM savedblogs WHERE blogid = ${req.params.id}`;
    await sql`DELETE FROM comments WHERE blogid = ${req.params.id}`;
    await sql`DELETE FROM blogs WHERE id = ${req.params.id}`;

    // await invalidateChacheJob(["blogs:*", `blog:${req.params.id}`]);

    return res.status(200).json({message:"blog deleted",success:true})
  } catch (error) {
    return res.status(500).json({error:error instanceof Error?error.message:"Error occured"})
  }
};

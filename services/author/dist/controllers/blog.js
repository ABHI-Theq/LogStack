"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlog = exports.updateBlog = exports.createBlog = void 0;
const datauri_1 = __importDefault(require("../utils/datauri"));
const cloudinary_1 = require("cloudinary");
const DBConnect_1 = require("../utils/DBConnect");
const createBlog = async (req, res) => {
    try {
        const { title, description, blogcontent, category } = req.body;
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: "file not foundt" });
        }
        const fileBuffer = (0, datauri_1.default)(file);
        if (!fileBuffer) {
            return res.status(400).json({ error: "Failed to generate file buffer" });
        }
        const cloud = await cloudinary_1.v2.uploader.upload(fileBuffer.content, {
            folder: "blogs",
        });
        const result = await (0, DBConnect_1.sql) `
    INSERT INTO blogs (title,description,image,blogcontent,category,author) VALUES (${title},${description}
    ,${cloud.secure_url},${blogcontent},${category},${req.user?._id}) RETURNING *;`;
        return res
            .status(201)
            .json({ message: "Blog created successfully", blog: result[0] });
    }
    catch (error) {
        return res.status(500).json({ error: error instanceof Error ? error.message : "Error occured" });
    }
};
exports.createBlog = createBlog;
const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, blogcontent, category } = req.body;
        const file = req.file;
        const blogs = await (0, DBConnect_1.sql) `SELECT * FROM blogs WHERE id=${id}`;
        if (blogs.length == 0) {
            return res.status(404).json({ error: "Blog not found" });
        }
        if (blogs[0].author !== req.user?._id) {
            return res.status(403).json({ error: "You are not author of this blog" });
        }
        let imgUrl = blogs[0].image;
        if (file) {
            const fileBuffer = (0, datauri_1.default)(file);
            if (!fileBuffer || !fileBuffer.content) {
                return res
                    .status(400)
                    .json({ error: "Failed to generate file buffer" });
            }
            const cloud = await cloudinary_1.v2.uploader.upload(fileBuffer.content, {
                folder: "blogs",
            });
            imgUrl = cloud.secure_url;
        }
        const updatedBlog = await (0, DBConnect_1.sql) `UPDATE blogs SET 
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
    }
    catch (error) {
        return res.status(500).json({ error: error instanceof Error ? error.message : "Error occured" });
    }
};
exports.updateBlog = updateBlog;
const deleteBlog = async (req, res) => {
    try {
        const blog = await (0, DBConnect_1.sql) `SELECT * FROM blogs WHERE id = ${req.params.id}`;
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
        await (0, DBConnect_1.sql) `DELETE FROM savedblogs WHERE blogid = ${req.params.id}`;
        await (0, DBConnect_1.sql) `DELETE FROM comments WHERE blogid = ${req.params.id}`;
        await (0, DBConnect_1.sql) `DELETE FROM blogs WHERE id = ${req.params.id}`;
        // await invalidateChacheJob(["blogs:*", `blog:${req.params.id}`]);
        return res.status(200).json({ message: "blog deleted", success: true });
    }
    catch (error) {
        return res.status(500).json({ error: error instanceof Error ? error.message : "Error occured" });
    }
};
exports.deleteBlog = deleteBlog;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleBlog = exports.getAllBlogs = void 0;
const DBConnect_1 = require("../utils/DBConnect");
const axios_1 = __importDefault(require("axios"));
const __1 = require("..");
const getAllBlogs = async (req, res) => {
    try {
        const { searchQuery = "", category = "" } = req.body;
        const cacheKey = `blogs:${searchQuery}:${category}`;
        const cachedBlogs = await __1.redis.get(cacheKey);
        if (cachedBlogs) {
            console.log("serving from Redis cache");
            return res.status(200).json({ blogs: JSON.parse(cachedBlogs) });
        }
        let blogs;
        if (searchQuery && category) {
            blogs = await (0, DBConnect_1.sql) `SELECT * FROM blogs WHERE (title ILIKE ${"%" + searchQuery + "%"} OR description ILIKE ${"%" + searchQuery + "%"}) AND 
            category=${category} ORDER BY create_at DESC`;
        }
        else if (searchQuery) {
            blogs = await (0, DBConnect_1.sql) `SELECT * FROM blogs WHERE (title ILIKE ${"%" + searchQuery + "%"} OR description 
            ILIKE ${"%" + searchQuery + "%"}) ORDER BY create_at DESC`;
        }
        else if (category) {
            blogs = await (0, DBConnect_1.sql) `SELECT * FROM blogs WHERE category=${category} ORDER BY create_at DESC`;
        }
        else {
            blogs = await (0, DBConnect_1.sql) `SELECT * FROM blogs ORDER BY create_at DESC;`;
        }
        console.log("serving from DB");
        await __1.redis.set(cacheKey, JSON.stringify(blogs), {
            ex: 3600
        });
        return res
            .status(200)
            .json({ message: "blogs fetched successfully", blogs });
    }
    catch (error) {
        return res
            .status(400)
            .json({
            error: error instanceof Error
                ? error.message
                : "Error occured while feteching blogs",
        });
    }
};
exports.getAllBlogs = getAllBlogs;
const getSingleBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const cacheKey = `blogs:${id}`;
        const cachedBlog = await __1.redis.get(cacheKey);
        if (cachedBlog) {
            console.log("serving single blog from redis cache");
            return res.status(200).json({ blog: JSON.parse(cachedBlog) });
        }
        const blog = await (0, DBConnect_1.sql) `SELECT * FROM blogs WHERE id=${id};`;
        if (!blog[0]) {
            return res.status(404).json({ message: "Blog not found" });
        }
        const { data } = await axios_1.default.get(`${process.env.USER_SERVICE}/api/v1/user/${blog[0].author}`);
        const responseData = { blog: blog[0], author: data };
        await __1.redis.set(cacheKey, JSON.stringify(responseData));
        console.log("serving single blog from DB");
        return res.status(200).json({ message: "Blog fetched successfully", blog: blog[0], author: data });
    }
    catch (error) {
        return res.status(400).json({ error: error instanceof Error ? error.message : "Error occured" });
    }
};
exports.getSingleBlog = getSingleBlog;

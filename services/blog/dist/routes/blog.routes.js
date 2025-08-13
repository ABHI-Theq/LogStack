"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blog_controller_1 = require("../controllers/blog.controller");
const router = (0, express_1.Router)();
router.get("/blog/all", blog_controller_1.getAllBlogs);
router.get("/blog/:id", blog_controller_1.getSingleBlog);
exports.default = router;

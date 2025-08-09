"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const isAuth_1 = require("../middleware/isAuth");
const multer_1 = __importDefault(require("../middleware/multer"));
const blog_1 = require("../controllers/blog");
const router = (0, express_1.Router)();
router.post("/blog/new", isAuth_1.isAuth, multer_1.default, blog_1.createBlog);
router.post("/blog/:id", isAuth_1.isAuth, multer_1.default, blog_1.updateBlog);
router.delete("/blog/:id", isAuth_1.isAuth, blog_1.deleteBlog);
exports.default = router;

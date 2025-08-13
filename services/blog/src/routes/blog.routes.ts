import {Router} from "express"
import { getAllBlogs, getSingleBlog } from "../controllers/blog.controller"

const router =Router()

router.get("/blog/all",getAllBlogs)
router.get("/blog/:id",getSingleBlog)   

export default router
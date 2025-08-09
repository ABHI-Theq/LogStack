import {Router} from "express"
import { isAuth } from "../middleware/isAuth"
import uploadFile from "../middleware/multer"
import { createBlog, deleteBlog, updateBlog } from "../controllers/blog"

const router=Router()

router.post("/blog/new",isAuth,uploadFile,createBlog)
router.post("/blog/:id",isAuth,uploadFile,updateBlog)
router.delete("/blog/:id",isAuth,deleteBlog)

export default router
import {Router} from "express"
import { getUserById, LoginUser, myProfile, updateProfilePic, updateUserById } from "../Controllers/user.controller"
import { isAuth } from "../middleware/isAuth"
import uploadFile from "../middleware/multer"

const router=Router()

router.post("/signin",LoginUser)
router.get("/me",isAuth,myProfile)
router.get("/user/:id",isAuth,getUserById)
router.post("user/update",isAuth,updateUserById)
router.post("/user/update/pic", isAuth, uploadFile, updateProfilePic);

export default router
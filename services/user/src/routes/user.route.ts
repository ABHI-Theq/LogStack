import {Router} from "express"
import { getUserById, LoginUser, myProfile, updateUserById } from "../Controllers/user.controller"
import { isAuth } from "../middleware/isAuth"

const router=Router()

router.post("/signin",LoginUser)
router.get("/me",isAuth,myProfile)
router.get("/user/:id",isAuth,getUserById)
router.post("user/update",isAuth,updateUserById)

export default router
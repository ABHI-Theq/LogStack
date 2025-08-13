"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../Controllers/user.controller");
const isAuth_1 = require("../middleware/isAuth");
const multer_1 = __importDefault(require("../middleware/multer"));
const router = (0, express_1.Router)();
router.post("/signin", user_controller_1.LoginUser);
router.get("/me", isAuth_1.isAuth, user_controller_1.myProfile);
router.get("/user/:id", isAuth_1.isAuth, user_controller_1.getUserById);
router.post("user/update", isAuth_1.isAuth, user_controller_1.updateUserById);
router.post("/user/update/pic", isAuth_1.isAuth, multer_1.default, user_controller_1.updateProfilePic);
exports.default = router;

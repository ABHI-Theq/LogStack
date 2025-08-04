"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../Controllers/user.controller");
const isAuth_1 = require("../middleware/isAuth");
const router = (0, express_1.Router)();
router.post("/signin", user_controller_1.LoginUser);
router.get("/me", isAuth_1.isAuth, user_controller_1.myProfile);
exports.default = router;

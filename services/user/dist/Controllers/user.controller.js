"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.myProfile = exports.LoginUser = void 0;
const user_1 = __importDefault(require("../model/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const LoginUser = async (req, res) => {
    try {
        const { name, email, image } = req.body;
        let user = await user_1.default.findOne({ email });
        if (!user) {
            user = await user_1.default.create({ name, email, image });
        }
        const token = jsonwebtoken_1.default.sign({ user }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        res.status(200).json({
            success: true,
            user,
            token,
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Some error occurred";
        res.status(400).json({ error: errorMessage });
    }
};
exports.LoginUser = LoginUser;
const myProfile = async (req, res) => {
    try {
        const user = req.user;
        return res.status(200).json(user);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error occurred";
        return res.status(400).json({ message: errorMessage });
    }
};
exports.myProfile = myProfile;

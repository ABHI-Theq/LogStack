"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfilePic = exports.updateUserById = exports.getUserById = exports.myProfile = exports.LoginUser = void 0;
const user_1 = __importDefault(require("../model/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const datauri_1 = __importDefault(require("../utils/datauri"));
const cloudinary_1 = require("cloudinary");
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
const getUserById = async (req, res) => {
    try {
        const user = await user_1.default.findById(req.params.id);
        return res.status(200).json({
            message: "user feteched successfully",
            user
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error occurred";
        return res.status(400).json({ message: errorMessage });
    }
};
exports.getUserById = getUserById;
const updateUserById = async (req, res) => {
    try {
        const { name, instagram, facebook, linkedin, bio } = req.body;
        const user = await user_1.default.findByIdAndUpdate(req.user?._id, {
            name: name,
            instagram: instagram,
            facebook: facebook,
            linkedin: linkedin,
            bio: bio
        }, {
            new: true
        });
        const token = jsonwebtoken_1.default.sign({ user }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });
        return res.status(200).json({
            message: "updated user",
            user,
            token
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error occurred";
        return res.status(400).json({ message: errorMessage });
    }
};
exports.updateUserById = updateUserById;
const updateProfilePic = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({
                message: "No file to upload"
            });
        }
        const fileBuffer = (0, datauri_1.default)(file);
        if (!fileBuffer || !fileBuffer.content) {
            return res.status(400).json({
                message: "Failed to generate buffer"
            });
        }
        const cloud = await cloudinary_1.v2.uploader.upload(fileBuffer.content, {
            folder: "blogs"
        });
        const user = await user_1.default.findByIdAndUpdate(req.user?.id, {
            image: cloud.secure_url
        }, { new: true });
        const token = jsonwebtoken_1.default.sign({ user }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });
        return res.status(200).json({
            message: "User Profile Pic updated",
            user,
            token
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error occurred";
        return res.status(400).json({ message: errorMessage });
    }
};
exports.updateProfilePic = updateProfilePic;

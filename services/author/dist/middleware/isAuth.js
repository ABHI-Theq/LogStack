"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization || req.cookies?.token;
        if (!token || !token.startWith("Bearer ")) {
            return res.status(401).json({ message: "unauthorized" });
        }
        const decode = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!decode || !decode.user) {
            return res.status(401).json({ message: "unauthorized wrong token" });
        }
        req.user = decode.user;
        next();
    }
    catch (error) {
        console.log("JWT verify error: ", error);
        return res.status(401).json({ message: "Unauthorized" });
    }
};
exports.isAuth = isAuth;

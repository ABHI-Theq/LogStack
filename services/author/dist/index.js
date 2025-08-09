"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const DBConnect_1 = require("./utils/DBConnect");
const blog_route_1 = __importDefault(require("./routes/blog.route"));
const cloudinary_1 = require("cloudinary");
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});
const app = (0, express_1.default)();
async function initDB() {
    try {
        await (0, DBConnect_1.sql) `
            CREATE TABLE IF NOT EXISTS blogs(
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description VARCHAR(255) NOT NULL,
            blogcontent TEXT NOT NULL,
            image VARCHAR(255) NOT NULL,
            category VARCHAR(255) NOT NULL,
            author VARCHAR(255) NOT NULL,
            create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`;
        await (0, DBConnect_1.sql) `
            CREATE TABLE IF NOT EXISTS comments(
            id SERIAL PRIMARY KEY,
            comment VARCHAR(255) NOT NULL,
            userid VARCHAR(255) NOT NULL,
            username VARCHAR(255) NOT NULL,
            blogid VARCHAR(255) NOT NULL,
            create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`;
        await (0, DBConnect_1.sql) `
            CREATE TABLE IF NOT EXISTS savedblogs(
            id SERIAL PRIMARY KEY,
            userid VARCHAR(255) NOT NULL,
            blogid VARCHAR(255) NOT NULL,
            create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`;
        console.log("database intialized");
    }
    catch (error) {
        console.error("Error: ", error);
    }
}
app.use(express_1.default.json());
app.use((0, express_1.urlencoded)({ extended: true }));
app.use("/api/v1", blog_route_1.default);
initDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running at http://localhost:4001`);
    });
});

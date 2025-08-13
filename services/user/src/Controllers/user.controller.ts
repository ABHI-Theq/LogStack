import { Request, Response } from "express";
import User from "../model/user";
import jwt from "jsonwebtoken";
import getBuffer from "../utils/datauri";
import {v2 as cloudinary} from "cloudinary";

export const LoginUser = async (req: Request, res: Response) => {
  try {
    const { name, email, image } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ name, email, image });
    }

    const token = jwt.sign({ user }, process.env.JWT_SECRET as string, {
      expiresIn: "1d",
    });

    res.status(200).json({
      success: true,
      user,
      token,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Some error occurred";
    res.status(400).json({ error: errorMessage });
  }
};

export const myProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user; 
    return res.status(200).json(user);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Error occurred";
    return res.status(400).json({ message: errorMessage });
  }
};

export const getUserById=async (req:Request,res:Response)=>{
    try {
        const user=await User.findById(req.params.id)
        return res.status(200).json({
            message:"user feteched successfully",
            user
        })
    } catch (error) {
         const errorMessage =
      error instanceof Error ? error.message : "Error occurred";
    return res.status(400).json({ message: errorMessage });
    }
}

export const updateUserById=async (req:Request,res:Response)=>{
    try {
        
        const {name,instagram,facebook,linkedin,bio}=req.body;
        const user=await User.findByIdAndUpdate(req.user?._id,{
            name:name,
            instagram:instagram,
            facebook:facebook,
            linkedin:linkedin,
            bio:bio
        },{
            new:true
        })

        const token=jwt.sign({user},process.env.JWT_SECRET as string,{
            expiresIn:"1d"
        })

        return res.status(200).json({
            message:"updated user",
            user,
            token
        })


    } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error occurred";
    return res.status(400).json({ message: errorMessage });
    }
}
export const updateProfilePic=async(req:Request,res:Response)=>{
  try {
    const file=req.file;
    if(!file){
      return res.status(400).json({
        message:"No file to upload"
      })
    }
    const fileBuffer=getBuffer(file)

    if(!fileBuffer || !fileBuffer.content){
return res.status(400).json({
        message:"Failed to generate buffer"
      })
    }

    const cloud=await cloudinary.uploader.upload(fileBuffer.content,{
      folder:"blogs"
    })

    const user=await User.findByIdAndUpdate(req.user?.id,{
      image:cloud.secure_url
    },{new:true})

    const token=jwt.sign({user},process.env.JWT_SECRET as string,{
            expiresIn:"1d"
        })

        return res.status(200).json({
            message:"User Profile Pic updated",
            user,
            token
        })

  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error occurred";
    return res.status(400).json({ message: errorMessage });
  }
}

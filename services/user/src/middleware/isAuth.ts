import { NextFunction,Request,Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
export const isAuth=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const token=req.headers.authorization || req.cookies?.token;
        if(!token || !token.startWith("Bearer ")){
            return res.status(401).json({message:"unauthorized"})   
        }

        const decode= jwt.verify(token,process.env.JWT_SECRET as string) as JwtPayload

        if(!decode || !decode.user){
                    return res.status(401).json({message:"unauthorized wrong token"})  
        }

        req.user=decode.user;

        next()
    } catch (error) {
        console.log("JWT verify error: ",error)
        return res.status(401).json({message:"Unauthorized"})
    }
}
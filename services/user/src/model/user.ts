import mongoose,{Document,Schema} from "mongoose"

export interface IUser extends Document{
    name:string,
    email:string,
    image:string,
    facebook:string,
    instagram:string,
    linkedin:string,
    bio:string
}

const UserSchema: Schema<IUser>=new mongoose.Schema({
    name:{
        required:true,
        type:String
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    image:{
        type:String,
        required:true
    },
    facebook:String,
    instagram:String,
    linkedin:String,
    bio:String
},{timestamps:true} )

const User=mongoose.model<IUser>("user",UserSchema)

export default User
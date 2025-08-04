import mongoose from "mongoose"

const DBConnect=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_STRING as string)
        console.log("DB COnnected");
        

    } catch (error) {
        console.error("error: ",error)
    }
}

export default DBConnect

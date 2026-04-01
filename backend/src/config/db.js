import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        console.log("Error in connecting Mongo DB" + error);
    }
}

export default connectDB;
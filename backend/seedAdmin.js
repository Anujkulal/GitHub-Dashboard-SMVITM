import connectDB from "./config/db.js"
import { configDotenv } from "dotenv";
import UserModel from "./models/userModel.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

configDotenv();

const seedAdmin = async () => {
    try{
        await connectDB(process.env.MONGO_URI);

        await UserModel.deleteMany({});
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("admin123", salt);

        await UserModel.create({
            email: "admin@gmail.com",
            password: hashedPassword,
            role: "Admin",
        })
        const userDetails = await UserModel.find({});
        console.log("Admin details: ", userDetails);
    } catch(error){
        console.error("Error while seeding:", error);
    }
    finally{
        await mongoose.connection.close();
        process.exit();
    }
}

seedAdmin();
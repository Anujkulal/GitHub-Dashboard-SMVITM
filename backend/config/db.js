import mongoose from "mongoose";

async function connectDB(url) {
    await mongoose.connect(url)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });
}

export default connectDB;
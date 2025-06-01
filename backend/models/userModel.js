import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Admin"],
      default: "Admin",
      required: true,
    },
}, {timestamps: true})

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
import bcrypt from "bcryptjs"
import UserModel from "../models/userModel.js";
import createToken from "../utils/createToken.js";

// const addFacultyController = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const existingFaculty = await UserModel.findOne({ email });
//     if (existingFaculty) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const newUser = new UserModel({
//       email,
//       password: hashedPassword,
//       role: "Faculty",
//     });
//     await newUser.save();

//     return res.status(201).json({
//       message: "Faculty registered successfully",
//       user: {
//         _id: newUser._id,
//         email: newUser.email,
//         role: newUser.role,
//       },
//     });
//   } catch (error) {
//     console.error("Error while adding user");
//     res.status(500).json({ message: "Server error" });
//   }
// };

const adminLoginController = async(req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await UserModel.findOne({ email });
    //find user
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    //check role
    if (user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied: Not an admin" });
    }

    //compare password
    const isValidPassword = await bcrypt.compare(password, user.password);
    // console.log("compare password", isValidPassword);

    if (isValidPassword) {
      const token = createToken(res, user._id);
      // console.log("token", token);
      return res
        .status(201)
        .json({
          message: "Admin logged in successfully",
          token,
          user: { _id: user._id, email: user.email, role: user.role },
        });
    } else {
      return res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error while logging user");
    res.status(500).json({ message: "Server error" });
  }
}

const updateAdminLoggedInPasswordController = async (req, res) => {
  try{
    const {currentPassword, newPassword} = req.body;
    const {email} = req.user;
    if(!currentPassword || !newPassword){
      return res.status(400).json({message: "All fields are required"});
    }

    const user = await UserModel.findOne({email});
    if(!user){
      return res.status(404).json({message: "Admin not found"});
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if(!isValidPassword){
      return res.status(400).json({message: "Invalid credentials"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const updatedUser = await UserModel.findOneAndUpdate({email}, {password: hashedPassword}, {new: true});
    if(!updatedUser){
      return res.status(404).json({message: "Admin not found"});
    }

    return res.status(200).json({message: "Password updated successfully"});
  } catch(error){
    console.error("Error while updating admin password:", error);
    res.status(500).json({ message: "Server error" });
  }
}

const userLogoutController = async (req, res) => {
  try {
    const cookie = req.cookies.jwt;

    if (!cookie) {
      return res.status(400).json({ message: "User not logged in" });
    }

    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("User logout error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// const facultyLoginController = async(req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const user = await UserModel.findOne({ email });
//     //find user
//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     //check role
//     if (user.role !== "Faculty") {
//       return res.status(403).json({ message: "Access denied: Not an Faculty" });
//     }

//     //compare password
//     const isValidPassword = await bcrypt.compare(password, user.password);
//     // console.log("compare password", isValidPassword);

//     if (isValidPassword) {
//       const token = createToken(res, user._id);
//       // console.log("token", token);
//       return res
//         .status(201)
//         .json({
//           message: "Faculty logged in successfully",
//           token,
//           user: { _id: user._id, email: user.email, role: user.role },
//         });
//     } else {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }
//   } catch (error) {
//     console.error("Error while logging user");
//     res.status(500).json({ message: "Server error" });
//   }
// }

export { 
  adminLoginController,
  userLogoutController,
  updateAdminLoggedInPasswordController,
};

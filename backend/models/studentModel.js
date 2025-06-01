import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: String,
  usn: {
    type: String,
    // unique: true,
  },
  institute: String,
  githubId: {
    type: String,
    unique: true,
  },
  githubUsername: String,
  avatar_url: String,
  lastActive: Date,
  commitCount: Number,
  prCount: Number,
});
const StudentModel = mongoose.model('Student', studentSchema);

export default StudentModel;
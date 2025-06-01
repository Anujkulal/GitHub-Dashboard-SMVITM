import StudentModel from "../models/studentModel.js";
// import mongoose from "mongoose";

const addGithubDetails = async (req, res) => {
    try {
        const {githubId, name, usn, institute, githubUsername, avatar_url, lastActive, commitCount} = req.body;

        let student = await StudentModel.findOne({githubId})
        console.log("Student:", student);
        if(!student){
            student = new StudentModel({
                githubId,
                name,
                githubUsername,
                avatar_url,
                usn: usn || "",
                institute: institute || "",
                lastActive,
                commitCount: commitCount || 0,
            })
            await student.save();
            return res.status(201).json(student);
        }
        else{
            return res.status(400).json({message: "Student already exists"});
        }
    } catch (error) {
        console.error("Error while adding github details:", error);
        res.status(500).json({ message: "Server error" });
    }
}

const updateInfoDetails = async (req, res) => {
    try{
        const {githubId} = req.params;
        const {name, usn, institute} = req.body;

        let existingStudent = await StudentModel.findOne({ githubId });

        if (!existingStudent) {
            return res.status(404).json({ message: "GitHub user not found" });
        }
        
        const updatedInfo = await StudentModel.findOneAndUpdate(
            { githubId },
            { name, usn, institute },
            { new: true, upsert: true } // upsert will create a new document if it doesn't exist
        );
        // await student.save()
        return res.status(201).json(updatedInfo); 
    } catch(error){
        console.error("Error while updating information:", error);
        res.status(500).json({ message: "Server error" });
    }
}

const deleteStudentDetails = async (req, res) => {
    try {
        const { githubId } = req.params;
        const student = await StudentModel.findOneAndDelete({githubId});
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        return res.status(200).json({ message: "Student details deleted successfully" });
    } catch (error) {
        console.error("Error while deleting student details:", error);
        res.status(500).json({ message: "Server error" }); 
    }
}

const getGithubDetails = async (req, res) => {
    try{
        const students = await StudentModel.find({});
        if(students.length === 0){
            return res.status(404).json({message: "No students found"});
        }
        return res.status(200).json(students);
    }
    catch(error){
        console.error("Error while fetching students:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export {
    addGithubDetails,
    updateInfoDetails,
    getGithubDetails,
    deleteStudentDetails,
}
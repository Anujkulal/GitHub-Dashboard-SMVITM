import express from 'express';
import StudentModel from '../models/studentModel.js';
import { addGithubDetails, updateInfoDetails, getGithubDetails, deleteStudentDetails } from '../controllers/studentController.js';
import { authenticate, roleOnly } from '../middlewares/authenticate.js';

const router = express.Router();

router.post("/add", addGithubDetails)
router.put("/info/:githubId", authenticate, roleOnly("Admin"), updateInfoDetails)
router.delete("/:githubId", authenticate, roleOnly("Admin"), deleteStudentDetails)
router.get("/", getGithubDetails);



// router.post('/', async (req, res) => {
//   const { name, usn, githubUsername } = req.body;
//   try {
//     const student = new StudentModel({ name, usn, githubUsername });
//     await student.save();
//     res.json(student);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

router.get('/', async (req, res) => {
  const students = await StudentModel.find();
  res.json(students);
});

export default router;
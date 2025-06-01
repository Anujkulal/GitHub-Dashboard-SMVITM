import express from 'express';
import axios from 'axios';

import StudentModel from '../models/studentModel.js';

const router = express.Router();

const fetchGitHubActivity = async (username) => {
  const url = `https://api.github.com/users/${username}/events/public`;
  const headers = { Authorization: `token ${process.env.GITHUB_TOKEN}` };
  const response = await axios.get(url, { headers });
  return response.data;
};

router.get('/top-contributors', async (req, res) => {
  const students = await StudentModel.find();
  const enriched = await Promise.all(students.map(async student => {
    try {
      const events = await fetchGitHubActivity(student.githubUsername);
      const now = new Date();
      let commits = 0, prs = 0;

      events.forEach(e => {
        if (e.type === 'PushEvent') commits += e.payload.commits.length;
        if (e.type === 'PullRequestEvent') prs++;
      });

      student.commitCount = commits;
      student.prCount = prs;
      student.lastActive = events[0]?.created_at ? new Date(events[0].created_at) : null;
      await student.save();
      return student;
    } catch {
      return student;
    }
  }));

  enriched.sort((a, b) => (b.commitCount + b.prCount) - (a.commitCount + a.prCount));
  res.json(enriched.slice(0, 10));
});

router.get('/inactive', async (req, res) => {
  const students = await StudentModel.find();
  const threshold = new Date();
  threshold.setDate(threshold.getDate() - 30);

  const inactive = students.filter(s => !s.lastActive || new Date(s.lastActive) < threshold);
  res.json(inactive);
});


export default router;
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Image from "@/components/ui/Image";
import githubApi from "@/services/githubApi.js";
import { useStore } from "@/zustand/store";
import { Button } from "@/components/ui/Button";
import { MdDelete } from "react-icons/md";

const base_backend_url =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const fetchAllRepos = async (username) => {
  let page = 1;
  let allRepos = [];
  while (true) {
    const response = await githubApi.get(`/users/${username}/repos`, {
      params: { sort: "updated", per_page: 100, page },
    });
    allRepos = allRepos.concat(response.data);
    if (response.data.length < 100) break;
    page++;
  }
  return allRepos;
};

const calculateActivity = (profile, repos) => {
  const repoScore = Math.min(profile.public_repos / 30, 1) * 25;
  const followerScore = Math.min(profile.followers / 50, 1) * 15;
  let commitScore = 0;
  let updatedScore = 0;

  if (repos.length > 0) {
    const now = new Date();
    const recentUpdates = repos.filter((repo) => {
      const updatedDate = new Date(repo.updated_at);
      const monthsDiff =
        (now.getFullYear() - updatedDate.getFullYear()) * 12 +
        now.getMonth() -
        updatedDate.getMonth();
      return monthsDiff <= 1;
    }).length;
    updatedScore = (recentUpdates / repos.length) * 20;

    let activitySum = 0;
    repos.forEach((repo) => {
      const createdDate = new Date(repo.created_at);
      const updatedDate = new Date(repo.updated_at);
      const daysDiff = (updatedDate - createdDate) / (1000 * 60 * 60 * 24);
      if (daysDiff > 0 && repo.updated_at !== repo.created_at) {
        activitySum += Math.min(daysDiff / 30, 10);
      }
    });
    commitScore = Math.min(activitySum / 30, 1) * 20;
  }

  return {
    totalCommits: Math.round(commitScore),
    activityPercent: Math.round(
      repoScore + followerScore + updatedScore + commitScore
    ),
  };
};

export default function ReportDashboard() {
  const [topContributors, setTopContributors] = useState([]);
  const [inactiveStudents, setInactiveStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useStore();

  useEffect(() => {
    // Fetch students from backend
    axios.get(`${base_backend_url}/api/students`).then(async (res) => {
      const students = res.data;

      if (!students || students.length === 0) {
      setTopContributors([]);
      setInactiveStudents([]);
      setLoading(false);
      return;
    }

      // For each student, fetch GitHub data and calculate metrics
      const enriched = await Promise.all(
        students.map(async (student) => {
          setLoading(true);
          try {
            const userResponse = await githubApi.get(
              `/users/${student.githubUsername}`
            );
            const profile = userResponse.data;
            const repos = await fetchAllRepos(student.githubUsername);
            const { totalCommits, activityPercent } = calculateActivity(
              profile,
              repos
            );

            setLoading(false);
            return {
              ...student,
              avatar_url: profile.avatar_url,
              totalCommits,
              activityPercent,
            };
          } catch (err) {
            // If GitHub fetch fails, fallback to student data
            return {
              ...student,
              totalCommits: 0,
              activityPercent: 0,
            };
          }
        })
      );

      // Sort by totalCommits, then by activityPercent
      const sorted = enriched
        .sort((a, b) => {
          if (b.totalCommits !== a.totalCommits) {
            return b.totalCommits - a.totalCommits;
          }
          return b.activityPercent - a.activityPercent;
        })
        .slice(0, 10);

      setTopContributors(sorted);

      // Optionally, set inactive students (example: activityPercent < 10)
      setInactiveStudents(enriched.filter((s) => s.totalCommits < 1));
    });
    setLoading(false);
  }, []);

  const handleDeleteStudent = async (githubId) => {
    if (!window.confirm("Are you sure you want to delete this student?"))
      return;
    try {
      await axios.delete(`${base_backend_url}/api/students/${githubId}`, {
        withCredentials: true,
      });
      // Remove from both lists in UI
      setTopContributors((prev) => prev.filter((s) => s.githubId !== githubId));
      setInactiveStudents((prev) =>
        prev.filter((s) => s.githubId !== githubId)
      );
    } catch (err) {
      alert("Failed to delete student.");
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-gray-300">
      <header className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white">
          GitHub Activity Report
        </h1>
        <p className="text-gray-400 mt-2">
          Top contributors and inactive students in the last 30 days
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Top Contributors */}
        <motion.div
          className="bg-gray-800 rounded-xl shadow-lg p-6 r"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-4 text-green-400">
            Top 10 Contributors
          </h2>
          {loading ? (
            <div className="text-center text-gray-400">Loading...</div>
          ) : topContributors.length === 0 ? (
    <div className="text-center text-gray-400">No students found.</div>
  ):
           (
            <ul className="space-y-3">
              {topContributors.map((student, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center border-b border-gray-700 pb-2"
                >
                  <div className="flex gap-4 flex-wrap">
                    <Image size="small" src={student.avatar_url} alt="image" />
                    <div className="">
                      <p className="font-medium text-white w-30">
                        {student.name}
                      </p>
                      <p className="text-sm text-gray-400">
                        <a
                          href={`https://github.com/${student.githubUsername}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          @{student.githubUsername}
                        </a>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-sm text-right">
                      <p>
                        Commits:{" "}
                        <span className="font-semibold text-white">
                          {student.totalCommits}
                        </span>
                      </p>
                      <p>
                        Activity:{" "}
                        <span className="font-semibold text-white">
                          {student.activityPercent}%
                        </span>
                      </p>
                    </div>
                    {isLoggedIn && (
                      <Button
                        variant="destructive"
                        className="mt-2 px-2 py-1 rounded text-xs bg-red-600 hover:bg-red-700 text-white flex items-center gap-1 transition-colors"
                        onClick={() => handleDeleteStudent(student.githubId)}
                      >
                        <MdDelete className="text-base" />
                        <span className="hidden sm:inline">Delete</span>
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </motion.div>

        {/* Inactive Students */}
        <motion.div
          className="bg-gray-800 rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-4 text-red-400">
            Inactive in Last 30 Days
          </h2>
          {loading ? (
            <div className="text-center text-gray-400">Loading...</div>
          ) : (
            <ul className="space-y-2">
              {inactiveStudents.map((student, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center border-b border-gray-700 pb-2"
                >
                  <div>
                    <span className="text-white">{student.name}</span>
                    <span className="text-gray-400 text-sm ml-2">
                      <a
                        href={`https://github.com/${student.githubUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        @{student.githubUsername}
                      </a>
                    </span>
                  </div>
                  {isLoggedIn && (
                    <Button
                      variant="destructive"
                      className="mt-2 px-2 py-1 rounded text-xs bg-red-600 hover:bg-red-700 text-white flex items-center gap-1 transition-colors"
                      onClick={() => handleDeleteStudent(student.githubId)}
                    >
                      <MdDelete className="text-base" />
                      <span className="hidden sm:inline">Delete</span>
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
    </div>
  );
}

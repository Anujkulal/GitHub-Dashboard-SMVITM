import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/zustand/store";
import Image from "@/components/ui/Image";
import { FaLongArrowAltRight } from "react-icons/fa";
import DetailsCard from "./DetailsCard";

export default function ProfileCard({ user }) {
  // const [showPopup, setShowPopup] = useState(false);
  const { setShowPopup, showPopup } = useStore();

  const getRankColor = (rank) => {
    if (rank >= 80) return "text-green-600";
    if (rank >= 50) return "text-yellow-600";
    if (rank >= 30) return "text-orange-600";
    return "text-red-500";
  };

  const handleClick = (html_url) => {
    window.open(html_url, "_blank", "noopener,noreferrer");
  };

  const rankColor = getRankColor(user.activityPercent);

  return (
    <motion.div
      className="max-w-sm w-full bg-gray-800 shadow-lg rounded-2xl p-6 text-center border"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Image
        src={user.avatar_url}
        alt="avatar"
        whileHover={{ scale: 1.05 }}
        size="medium"
        className="mx-auto mb-4 border-4 border-blue-100"
      />

      <h2 className="text-xl font-semibold text-gray-200">
        {user.name || user.login}
      </h2>
      <p className="text-gray-500 text-sm">@{user.login}</p>
      {user.bio && <p className="text-gray-300 mt-2 text-sm">{user.bio}</p>}

      <div className="flex justify-around mt-4 text-sm text-gray-300">
        <div>
          <span className="font-bold">{user.public_repos}</span>
          <p>Repos</p>
        </div>
        <div>
          <span className="font-bold">{user.followers}</span>
          <p>Followers</p>
        </div>
        <div>
          <span className="font-bold">{user.following}</span>
          <p>Following</p>
        </div>
      </div>
      {/* Activity Bar */}
      <div className="mt-4">
        <p className="text-sm text-gray-500 mb-1">
          Activity{" "}
          <span className={`${rankColor}`}>{user.activityPercent}%</span> (Last
          30 Days) {user.totalCommits} Commits
        </p>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden border">
          <div
            className={`h-full ${rankColor} bg-current rounded-full`}
            style={{ width: `${Math.min(user.activityPercent || 0, 100)}%` }}
          ></div>
        </div>
      </div>

      <div className="m-4 flex gap-2 justify-between">
        <Button variant="default" onClick={() => setShowPopup(true)}>
          Add
        </Button>
        <Button variant="default" className="" onClick={() => handleClick(user.html_url)}>
            View Profile <FaLongArrowAltRight />
        </Button>
      </div>
      <AnimatePresence>{showPopup && <DetailsCard user={user} />}</AnimatePresence>
    </motion.div>
  );
}

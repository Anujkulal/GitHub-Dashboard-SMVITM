import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

import DetailsCard from "@/components/feature/DetailsCard";
import { useStore } from "@/zustand/store";
import ProfileList from "@/components/feature/ProfileList";
import SearchState from "@/components/feature/SearchState";
import ResultState from "../components/feature/ResultState";

export default function LandingPage() {
  // const setShowPopup = useStore((state) => (state.setShowPopup));
  // const showPopup = useStore((state) => (state.showPopup));
  const { showPopup, searchGitHubUsers, users, loading } = useStore();

  return (
    <div className="">
      {/* Main Content */}
      <main className="flex flex-col gap-2 items-center justify-center flex-grow p-6 text-center bg-gray-900">
        <motion.h2
          className="text-4xl font-extrabold text-gray-200 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Track GitHub Activity Effortlessly
        </motion.h2>
        <motion.p
          className="text-gray-400 mb-8 max-w-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          View rankings, identify inactive users, and monitor real-time
          contributions from your college or organization.
        </motion.p>

        <SearchState />

        <ResultState />
        {/* <ProfileCard user={thisUser} /> */}

        {/* Popup for Enter Details */}
        {/* <AnimatePresence>{showPopup && <DetailsCard />}</AnimatePresence> */}
      </main>
    </div>
  );
}

const thisUser = {
  avatar_url: "https://avatars.githubusercontent.com/u/583231?v=4",
  name: "Linus Torvalds",
  login: "torvalds",
  bio: "Creator of Linux and Git",
  public_repos: 100,
  followers: 2000000,
  following: 10,
  activityPercent: 80,
  html_url: "https://avatars.githubusercontent.com/u/583231?v=4",
};

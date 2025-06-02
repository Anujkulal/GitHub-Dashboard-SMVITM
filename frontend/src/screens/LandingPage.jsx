import React from "react";
import { motion } from "framer-motion";
import SearchState from "@/components/feature/SearchState";
import ResultState from "@/components/feature/ResultState";

export default function LandingPage() {

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

      </main>
    </div>
  );
}
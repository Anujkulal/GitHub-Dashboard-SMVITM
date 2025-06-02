import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/zustand/store";

const SearchState = () => {
  const { searchGitHubUsers, loading } = useStore();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchUser = () => {
    if (searchQuery.trim() !== "") {
      searchGitHubUsers(searchQuery.trim());
    }
  };

  return (
    <motion.div
      className="w-full max-w-md flex gap-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
    >
      <Input
        placeholder="Enter GitHub username..."
        className="flex-grow"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearchUser();
        }}
        disabled={loading}
      />
      <Button onClick={handleSearchUser} disabled={loading} className={`${loading ? "bg-gray-500 cursor-not-allowed" : ""}`}>
        {
            loading ? (
            <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
        />
            ) : (<FaSearch />)
        }
        
      </Button>
    </motion.div>
  );
};

export default SearchState;

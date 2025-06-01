import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useStore } from "@/zustand/store";
import axios from "axios";

const DetailsCard = ({ user }) => {
  const { setShowPopup } = useStore();

  const [inputvalues, setInputValues] = useState({
    name: user.name || user.login || "",
    usn: "",
    institute: "",
  });

  
  const handleSaveDetails = async () => {
    // Logic to save details goes here
    try {
      await axios.post("http://localhost:5000/api/students/add", {
        githubId: user.id,
        name: inputvalues.name,
        githubUsername: user.login,
        avatar_url: user.avatar_url,
        usn: inputvalues.usn,
        institute: inputvalues.institute,
      })

    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add student');
    }
    // For now, just close the popup
    setShowPopup(false);
  };
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gray-900 p-6 rounded-2xl border border-gray-700 w-[300px]"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <h3 className="text-xl text-gray-200 mb-4">Enter Details</h3>
        <Input
          placeholder="Name"
          type="text"
          value={inputvalues.name || ""}
          onChange={(e) =>
            setInputValues((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <Input
          placeholder="USN"
          type="text"
          value={inputvalues.usn || ""}
          onChange={(e) =>
            setInputValues((prev) => ({ ...prev, usn: e.target.value }))
          }
        />
        <Input
          placeholder="Institute"
          type="text"
          value={inputvalues.institute || ""}
          onChange={(e) =>
            setInputValues((prev) => ({ ...prev, institute: e.target.value }))
          }
        />

        <div className="flex justify-end gap-2">
          <Button variant="destructive" onClick={() => setShowPopup(false)}>
            Cancel
          </Button>
          <Button variant="default" onClick={handleSaveDetails}>
            Save
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DetailsCard;

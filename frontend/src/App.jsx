import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import LandingPage from "./screens/LandingPage";
import ReportDashboard from "./screens/ReportDashboard";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { useStore } from "./zustand/store";
import Signin from "./components/feature/Signin";

function App() {
   const { showSignin, checkAuth } = useStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="w-full h-screen flex flex-col justify-between bg-gray-900">
      {/* Header section  */}
      <Header />

      <div className="flex-grow flex flex-col">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/report" element={<ReportDashboard />} />
        </Routes>

        <AnimatePresence>
          {showSignin && <Signin />}
        </AnimatePresence>
      </div>

      {/* Footer section  */}
      <Footer />
    </div>
  );
}

export default App;

import React from "react";
import { IoIosLogIn, IoIosLogOut } from "react-icons/io";
import { FaRankingStar } from "react-icons/fa6";
import { Button } from "./Button";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Link } from "react-router";
import { useStore } from "@/zustand/store";
import { FaGithub } from "react-icons/fa";

const Header = () => {
  const { setShowSignin, isLoggedIn, logoutUser } = useStore();

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    logoutUser();
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 shadow">
      <h1 className="flex items-center gap-2 text-xl font-extrabold text-blue-300 tracking-tight drop-shadow-md">
        <Link
          to="/"
          className="flex items-center gap-2 hover:text-blue-400 transition-colors"
        >
          SMVITM <FaGithub className="inline-block text-xl mb-1" /> Track
        </Link>
      </h1>
      <div className="flex items-center gap-4">
        <Tooltip.Provider delayDuration={200}>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <Link to="report">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border-blue-300 text-blue-300 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                >
                  <FaRankingStar className="text-lg" />
                  <span className="hidden sm:inline">Rankings</span>
                </Button>
              </Link>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                side="top"
                align="center"
                className="bg-white text-black text-xs rounded px-2 py-1 shadow-md"
              >
                View Rankings
                <Tooltip.Arrow className="fill-white" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>

        <Tooltip.Provider delayDuration={200}>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              {isLoggedIn ? (
                <Button
                  variant="icon"
                  className="bg-red-200 hover:bg-red-400 text-red-800 px-3 py-2 rounded-lg transition-colors"
                  onClick={handleLogout}
                >
                  <IoIosLogOut className="text-lg" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              ) : (
                <Button
                  variant="icon"
                  className="bg-green-200 hover:bg-green-400 text-green-800 px-3 py-2 rounded-lg transition-colors"
                  onClick={() => setShowSignin(true)}
                >
                  <IoIosLogIn className="text-lg" />
                  <span className="hidden sm:inline">Login</span>
                </Button>
              )}
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                side="top"
                align="center"
                className="bg-white text-black text-xs rounded px-2 py-1 shadow-md"
              >
                {isLoggedIn ? "Logout" : "Login"}
                <Tooltip.Arrow className="fill-white" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>
    </header>
  );
};

export default Header;

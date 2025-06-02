import React, { useState } from 'react'
import { motion } from "framer-motion";
import { useStore } from '@/zustand/store';
import ProfileList from './ProfileList';
import ProfileCard from './ProfileCard';

const dotsContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2,
      repeat: Infinity,
    },
  },
};

const dotBounce = {
  initial: { y: 0 },
  animate: {
    y: [0, -6, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const ThreeDotLoader = () => (
  <motion.div
    className="flex space-x-1"
    variants={dotsContainer}
    initial="initial"
    animate="animate"
  >
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        variants={dotBounce}
        className="w-5 h-5 bg-gray-300 rounded-full"
      />
    ))}
  </motion.div>
);

const ResultState = () => {
    const { users, loading, notFound } = useStore();
    const [openIndex, setOpenIndex] = useState(null);

    if(!loading && users.length > 0) {
        return (
            <div className="flex flex-col gap-4">
                {users.map((user, index) => (
                    <div key={index} className={`${openIndex === index ? "bg-gray-800" : "bg-gray-900"} p-4 rounded-lg shadow-md transition-all duration-300`}>
                        <div className="flex items-center justify-center gap-2">
                            <ProfileList user={user} index={index} openIndex={openIndex} setOpenIndex={setOpenIndex} />
                            
                        </div>
                        {openIndex === index && (
                            <div className="mt-2">
                                <ProfileCard user={user} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        )
    }
    
    if(loading) {
        return <ThreeDotLoader />
    }
    if(notFound) {
        return <h1 className="text-red-500 text-center text-2xl">User not found!</h1>
    }
    if(!loading && users.length === 0) {
        return <h1 className="text-white text-center text-2xl">Search for GitHub users...</h1>
    }
    return (
        <div>ResultState</div>
    )
}

export default ResultState
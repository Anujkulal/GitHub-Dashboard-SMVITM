import React from "react";
import Image from "@/components/ui/Image";
import { Link } from "react-router";

const ProfileList = ({user, index, openIndex, setOpenIndex}) => {
  return (
    <div className="flex gap-10 flex-wrap items-center bg-gray-800 p-4 rounded-2xl border-1">
      <Image size="small" src={user.avatar_url} alt="image" />
      <div>
        <p className="font-medium text-white w-30"> {user.name} </p>
        <a href={user.html_url} target="_blank" className="text-sm text-gray-400" >@{user.login}</a>
      </div>
      <Link className="text-blue-400" onClick={() => setOpenIndex(openIndex === index ? null : index)}>
        {openIndex === index ? "Hide" : "View"}
      </Link>
    </div>
  );
};

export default ProfileList;

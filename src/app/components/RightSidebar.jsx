"use client";
import React from "react";
import { FiSearch } from "react-icons/fi";
import { FaUserPlus } from "react-icons/fa";

const RightSidebar = () => {
  const trends = [
    { title: "Next.js 15", tweets: "12.5K" },
    { title: "Clerk Auth", tweets: "9.1K" },
    { title: "MongoDB", tweets: "7.8K" },
  ];

  const suggestions = [
    { name: "Sarah Dev", username: "sarahcodes" },
    { name: "Ali UX", username: "aliuxui" },
  ];

  return (
    <aside className="w-[350px] hidden xl:block px-4 py-6 text-white  space-y-6 overflow-y-auto max-h-screen scrollbar-hide">
      {/* Search Bar */}
      <div className="flex items-center  px-4 py-2 rounded-full">
        <FiSearch className="text-gray-400 text-xl mr-2" />
        <input
          type="text"
          placeholder="Search"
          className="bg-transparent outline-none text-sm w-full text-white placeholder-gray-400"
        />
      </div>

      {/* Trends */}
      <div className=" border-1  border-[#2e3235] rounded-xl p-4 space-y-4">
        <h3 className="font-bold text-lg">Trends for you</h3>
        {trends.map((trend, i) => (
          <div key={i} className="text-sm hover:bg-[#2c2f33] p-2 rounded">
            <p className="font-semibold">{trend.title}</p>
            <p className="text-gray-500">{trend.tweets} Tweets</p>
          </div>
        ))}
      </div>

      {/* Who to Follow */}
      <div className="border-1  border-[#2e3235]  rounded-xl p-4 space-y-4">
        <h3 className="font-bold text-lg">Who to follow</h3>
        {suggestions.map((user, i) => (
          <div key={i} className="flex justify-between items-center hover:bg-[#2c2f33] p-2 rounded">
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-gray-500">@{user.username}</p>
            </div>
            <button className="bg-white text-black text-sm px-3 py-1 rounded-full flex items-center gap-1">
              <FaUserPlus />
              Follow
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default RightSidebar;

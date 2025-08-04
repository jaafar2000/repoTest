"use client";
import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { FaUserPlus } from "react-icons/fa";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";

const RightSidebar = () => {
  const [users, setUsers] = useState([]);
  const { user } = useUser();

  const trends = [
    { title: "Next.js 15", tweets: "12.5K" },
    { title: "Clerk Auth", tweets: "9.1K" },
    { title: "MongoDB", tweets: "7.8K" },
  ];

  // // const fetchUsers = async () => {
  // //   try {
  // //     const res = await fetch("/api/users");
  // //     if (!res.ok) throw new Error("Failed to fetch users");
  // //     return await res.json();
  // //   } catch (err) {
  // //     console.error("Error fetching users:", err);
  // //     return [];
  // //   }
  // // };

  // const handleFollow = async (userToFollowId) => {
  //   if (!user?.id || !userToFollowId) {
  //     console.warn("Missing user ID or target ID for follow");
  //     return;
  //   }

  //   try {
  //     const res = await fetch("/api/follow", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         userId: user?.id,
  //         userToFollow: userToFollowId,
  //       }),
  //     });

  //     const data = await res.json();

  //     if (data?.success) {
  //       const updatedUsers = await fetchUsers();
  //       setUsers(updatedUsers);
  //     }
  //   } catch (err) {
  //     console.error("Error following/unfollowing user:", err);
  //   }
  // };

  // useEffect(() => {
  //   const getUsers = async () => {
  //     const usersData = await fetchUsers();
  //     setUsers(usersData);
  //   };
  //   getUsers();
  // }, []);

  return (
    <aside className="w-[350px] hidden xl:block px-4 py-6 text-white space-y-6 overflow-y-auto max-h-screen scrollbar-hide">
      {/* Search Bar */}
      <div className="flex items-center px-4 py-2 rounded-full">
        <FiSearch className="text-gray-400 text-xl mr-2" />
        <input
          type="text"
          placeholder="Search"
          className="bg-transparent outline-none text-sm w-full text-white placeholder-gray-400"
        />
      </div>

      {/* Trends */}
      <div className="border border-[#2e3235] rounded-xl p-4 space-y-4">
        <h3 className="font-bold text-lg">Trends for you</h3>
        {trends.map((trend, i) => (
          <div key={i} className="text-sm hover:bg-[#2c2f33] p-2 rounded">
            <p className="font-semibold">{trend.title}</p>
            <p className="text-gray-500">{trend.tweets} Tweets</p>
          </div>
        ))}
      </div>

      {/* Who to Follow */}
      {/* <div className="border border-[#2e3235] rounded-xl p-4 space-y-4">
        <h3 className="font-bold text-lg">Who to follow</h3>
        {users.map(
          (u) =>
            u?.clerkId !== user?.id && (
              <div
                key={u._id}
                className="flex justify-between items-center hover:bg-[#2c2f33] p-2 rounded"
              >
                <div className="flex items-center gap-2">
                  <div className="w-[40px] h-[40px] relative rounded-full overflow-hidden">
                    <Image
                      src={u?.avatar}
                      alt={u?.username}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold">
                      {u?.firstName} {u?.lastName}
                    </p>
                    <p className="text-gray-500">@{u?.username}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleFollow(u._id)}
                  className="bg-white text-black text-sm px-3 py-1 rounded-full flex items-center gap-1"
                >
                  <FaUserPlus />
                  Follow
                </button>
              </div>
            )
        )}
      </div> */}
    </aside>
  );
};

export default RightSidebar;

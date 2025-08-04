"use client";

import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { FaUserPlus, FaUserCheck } from "react-icons/fa";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";

const RightSidebar = () => {
  const [users, setUsers] = useState([]);
  const [trending, setTrending] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [followingUpdatingIds, setFollowingUpdatingIds] = useState(new Set());
  const { user } = useUser();

  // Fetch trending news
  const fetchTrending = async () => {
    try {
      const res = await fetch("https://api.first.org/data/v1/news");
      if (!res.ok) throw new Error("Failed to fetch trending news");
      const json = await res.json();

    

      const newArr = json.data.slice(53, 56).map((item) => ({
        title: item.title,
        img: item.image || "/fallback-image.png",
        url: item.link,
        subreddit: "news",
      }));
      return newArr;
    } catch (err) {
      console.error("Failed to fetch trending:", err);
      return [];
    }
  };

  // Fetch users excluding current user
  const fetchUsers = async () => {
    try {
      if (!user?.id) return [];
      const res = await fetch(`/api/users?currentUserId=${user.id}`);
      if (!res.ok) throw new Error("Failed to fetch users");
      return await res.json();
    } catch (err) {
      console.error("Error fetching users:", err);
      return [];
    }
  };

  // Handle follow/unfollow with loading state per user
  const handleFollow = async (userToFollowId) => {
    if (!user?.id || !userToFollowId) return;

    setFollowingUpdatingIds((prev) => new Set(prev).add(userToFollowId));

    try {
      const res = await fetch("/api/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, userToFollow: userToFollowId }),
      });

      const data = await res.json();
      if (data?.success) {
        const updatedUsers = await fetchUsers();
        setUsers(updatedUsers);
      }
    } catch (err) {
      console.error("Error following/unfollowing user:", err);
    } finally {
      setFollowingUpdatingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userToFollowId);
        return newSet;
      });
    }
  };

  // Initial fetch trending
  useEffect(() => {
    fetchTrending().then(setTrending);
  }, []);

  // Fetch users on user id change
  useEffect(() => {
    if (!user?.id) {
      setUsers([]);
      return;
    }
    fetchUsers().then(setUsers);
  }, [user?.id]);

  // Filter users by search term
  const filteredUsers = users.filter((u) => {
    if (!u?.firstName && !u?.lastName && !u?.username) return false;
    const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
    const username = u.username?.toLowerCase() || "";
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      username.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <aside
      className="
        w-[350px] hidden xl:block px-4 py-6 text-white space-y-6
        overflow-y-auto max-h-screen
        scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent
      "
      style={{ scrollbarWidth: "hidden" }}
    >
      {/* Search */}
      <div className="flex items-center px-4 py-2 rounded-full bg-[#1e2124]">
        <FiSearch className="text-gray-400 text-xl mr-2" />
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent outline-none text-sm w-full text-white placeholder-gray-400"
          aria-label="Search users"
        />
      </div>

      {/* Trending Section */}
      <div
        className="
          border border-[#2e3235] rounded-xl p-4 space-y-4
          max-h-[45vh] overflow-y-auto
        "
      >
        <h3 className="font-bold text-lg">What’s happening</h3>
        {trending.length > 0 ? (
          trending.map((item, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-2 rounded hover:bg-[#2c2f33]"
            >
              <div className="flex-shrink-0 w-[80px] h-[60px] overflow-hidden rounded-sm">
                <Image
                  src={item.img}
                  alt={item.title || "Trending news image"}
                  width={80}
                  height={60}
                  className="object-contain"
                  unoptimized
                  // unoptimized because these are external images without config
                />
              </div>
              <div className="flex flex-col">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-sm"
                  style={{ maxWidth: "calc(350px - 80px - 24px)" }}
                >
                  {item.title}
                </a>
                <p className="text-gray-500 text-xs mt-1">r/{item.subreddit}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">Loading trending news...</p>
        )}
      </div>

      {/* Who to Follow */}
      <div className="border border-[#2e3235] rounded-xl p-4 space-y-4">
        <h3 className="font-bold text-lg">Who to follow</h3>
        {filteredUsers.length > 0 ? (
          filteredUsers.map(
            (u) =>
              u?.clerkId !== user?.id && (
                <div
                  key={u._id}
                  className="flex justify-between items-center hover:bg-[#2c2f33] p-2 rounded"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-[40px] h-[40px] relative rounded-full overflow-hidden">
                      <Image
                        src={u?.avatar || "/fallback-avatar.png"}
                        alt={u?.username || "User avatar"}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="40px"
                        unoptimized
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">
                        {u?.firstName} {u?.lastName}
                      </p>
                      <p className="text-gray-500 text-xs">@{u?.username}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleFollow(u._id)}
                    disabled={followingUpdatingIds.has(u._id)}
                    className={`text-sm px-2 py-1 rounded-full flex items-center gap-1 transition-colors duration-200 ${
                      u.isFollowing
                        ? "bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                        : "bg-white text-black hover:bg-gray-200 disabled:opacity-50"
                    }`}
                    aria-label={
                      u.isFollowing
                        ? `Unfollow ${u.username}`
                        : `Follow ${u.username}`
                    }
                  >
                    {u.isFollowing ? <FaUserCheck /> : <FaUserPlus />}
                    {followingUpdatingIds.has(u._id)
                      ? "Loading..."
                      : u.isFollowing
                      ? "Unfollow"
                      : "Follow"}
                  </button>
                </div>
              )
          )
        ) : (
          <p className="text-gray-500 text-sm">No suggestions yet.</p>
        )}
      </div>
    </aside>
  );
};

export default RightSidebar;

"use client";

import React, { useEffect, useState } from "react";
import { FaUserPlus, FaUserCheck } from "react-icons/fa";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import {useSearchStore} from "@/lib/actions/useStateStore";

const FollowSuggestions = ({  parent }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingIds, setUpdatingIds] = useState(new Set());
  const { user } = useUser();

  const { searchTerm } = useSearchStore();

  const fetchUsers = async () => {
    try {
      if (!user?.id) return [];
      const res = await fetch(`/api/users?currentUserId=${user.id}`);
      if (!res.ok) throw new Error("Failed to fetch users");

      const allUsers = await res.json();

      if (parent !== "users") {
        return allUsers.slice(1, 4);
      }

      return allUsers;
    } catch (err) {
      console.error("Error fetching users:", err);
      return [];
    }
  };
  const handleFollow = async (targetId) => {
    if (!user?.id || !targetId) return;

    setUpdatingIds((prev) => new Set(prev).add(targetId));

    try {
      const res = await fetch("/api/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, userToFollow: targetId }),
      });

      const data = await res.json();
      if (data?.success) {
        const updated = await fetchUsers();
        setUsers(updated);
      }
    } catch (err) {
      console.error("Error following/unfollowing user:", err);
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(targetId);
        return next;
      });
    }
  };

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    fetchUsers()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, [user?.id]);

  const filteredUsers = users.filter((u) => {
    if (!u?.firstName && !u?.lastName && !u?.username) return false;
    if (!searchTerm) return true;
    const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
    const username = u.username?.toLowerCase() || "";
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      username.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="border border-[#2e3235] rounded-xl p-4 space-y-4">
      <h3 className="font-bold text-lg">Who to follow </h3>
      {loading ? (
        <p className="text-gray-500 text-sm">Loading suggestions...</p>
      ) : filteredUsers.length > 0 ? (
        filteredUsers.map(
          (u) =>
            u?.clerkId !== user?.id && (
              <div
                key={u._id}
                className="flex justify-between items-center  p-2 "
              >
                <div className="flex items-center gap-2">
                  <div className="w-[30px] h-[30px]  relative rounded-full overflow-hidden">
                    <Image
                      src={u.avatar || "/fallback-avatar.png"}
                      alt={u.username || "User avatar"}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="30px"
                      unoptimized
                      />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">
                      {`${u.firstName} ${u.lastName}`.length > 14
                        ? `${u.firstName} ${u.lastName}`.slice(0, 10) + "..."
                        : `${u.firstName} ${u.lastName}`}
                    </p>
                    <p className="text-gray-500 text-xs">@{u.username}</p>
                  </div>
                </div>
                <button>
                  <Link href={`/chat/${u._id}`} >
                  Msg
                  </Link>
                </button>
                <button
                  onClick={() => handleFollow(u._id)}
                  disabled={updatingIds.has(u._id)}
                  className={`text-sm px-2 py-1 rounded-full flex items-center gap-1 transition-colors duration-200 
              text-white border-2 border-white cursor-pointer opacity-70 hover:opacity-100 
              disabled:opacity-50`}
                >
                  {u.isFollowing ? <FaUserCheck /> : <FaUserPlus />}
                  {updatingIds.has(u._id)
                    ? "Loading..."
                    : u.isFollowing
                    ? "Unfollow"
                    : "Follow"}
                </button>
              </div>
            )
        )
      ) : (
        <p className="text-gray-500 text-sm">No matching users found.</p>
      )}
      {parent !== "users" ? (
        <Link
          href={"/users"}
          className="text-blue-500 underline cursor-pointer"
        >
          Show More
        </Link>
      ) : (
        ""
      )}
    </div>
  );
};

export default FollowSuggestions;

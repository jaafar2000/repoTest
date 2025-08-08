"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { CircleArrowLeft, SendHorizontal } from "lucide-react";

const ChatPage = () => {
  const { user } = useUser();
  const { userId } = useParams();

  const [chatPartner, setChatPartner] = useState(null); 
  const [currentUserData, setCurrentUserData] = useState(null); 

  const fetchUsers = async () => {
    if (!user?.id) return; 

    try {
      const res = await fetch(`/api/users?currentUserId=${user.id}`);
      if (!res.ok) {
        console.error("Failed to fetch users");
        return;
      }

      const data = await res.json();

      const partner = data.find((u) => u?._id === userId);
      const currentUser = data.find((u) => u?.clerkId === user.id);

      setChatPartner(partner || null);
      setCurrentUserData(currentUser || null);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [userId, user?.id]);

  return (
    <div className="h-screen flex flex-col w-full md:w-2/3 lg:w-1/2 border-t md:border-t-0 md:border-r border-[#2e3235] text-white">
      <Link
        href="/"
        className="flex items-center border-[#2e3235] border-b hover:text-gray-300 transition duration-200"
      >
        <div className="flex px-4 py-4 text-3xl gap-3.5">
          <CircleArrowLeft className="size-9" />
          Chats
        </div>
      </Link>

      {chatPartner && (
        <div className="border-b border-[#2e3235] flex flex-row p-2 items-center gap-1.5">
          <div className="rounded-full w-[40px] h-[40px] overflow-hidden">
            <Image
              src={chatPartner.avatar}
              width={100}
              height={100}
              alt="user avatar"
              className="object-contain"
            />
          </div>
          <div>
            {chatPartner.firstName} {chatPartner.lastName}
          </div>
          <div className="text-sm text-gray-500">@{chatPartner.username}</div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      </div>

      <div className="border-t border-[#2e3235] p-2">
        <form
          className="flex items-center border-2 border-[#2e3235] rounded-4xl p-2 gap-2">
          {currentUserData && (
            <div className="rounded-full w-[40px] h-[40px] overflow-hidden">
              <Image
                src={currentUserData.avatar}
                width={40}
                height={40}
                alt="user avatar"
                className="object-cover"
              />
            </div>
          )}

          <input
            className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
            type="text"
            placeholder="Write your message"
          />

          <button
            type="submit"
            className="bg-white w-[40px] h-[40px] opacity-85 hover:opacity-100 cursor-pointer flex items-center justify-center rounded-full hover:bg-gray-200 active:scale-95 transition"
          >
            <SendHorizontal className="text-black" size={25} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;

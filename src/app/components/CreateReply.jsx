"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

const CreateReply = ({ PostAuthor, postId, refreshReplies }) => {
  const { user } = useUser();
  const [text, setText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text || !postId) return;

    try {
      const res = await fetch(`/api/posts/${postId}/replies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postText: text,
          userId: user?.id,
          parentPostId: postId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Reply failed");

      setText("");
      refreshReplies();
    } catch (err) {
      console.error("Reply error:", err.message);
    }
  };

  return (
    <div className="border-t border-b  border-[#2e3235] pt-2">
      <p className="text-sm text-gray-500 pl-5 mb-2">
        Replying to <span className="text-blue-400">@{PostAuthor}</span>
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-row sm:flex-row items-center gap-3 px-5 py-4"
      >
        <div className="w-10 h-10 relative rounded-full overflow-hidden shrink-0">
          <Image
            src={user?.imageUrl}
            width={100}
            height={100}
            alt="user"
            className="object-cover w-full h-full"
          />
        </div>

        <input
          type="text"
          placeholder="Post your reply"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 bg-transparent outline-none text-base text-white w-full"
        />

        <button
          type="submit"
          className="text-black font-semibold bg-gray-300 hover:bg-white transition px-3 py-1 rounded-full text-sm"
        >
          Reply
        </button>
      </form>
    </div>
  );
};

export default CreateReply;

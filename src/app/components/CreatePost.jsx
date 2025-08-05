"use client";

import { useState } from "react";
import React from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { AiOutlineFileAdd } from "react-icons/ai";

const CreatePost = ({ onPostCreated }) => {
  const { user } = useUser();
  const [file, setFile] = useState(null);
  const [postText, setPostText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!postText) {
      alert("Post text is required");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("postText", postText);
    formData.append("userId", user.id);
    if (file) formData.append("file", file);

    try {
      const response = await fetch(`/api/posts`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setPostText("");
        setFile(null);
        onPostCreated(data.post);
      } else {
        console.error("Upload failed:", data.error || response.statusText);
      }
    } catch (error) {
      console.error("Error uploading post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <p className="sticky top-0 z-10 text-center py-4 text-base sm:text-xl text-gray-200 uppercase font-semibold tracking-wide border-b border-[#2e3235] backdrop-blur-md shadow-md">
        Start a new post — share your ideas.
      </p>

      <form
        onSubmit={handleSubmit}
        className="px-5 py-6 space-y-6 border-b border-[#2e3235]"
      >
        <div className="flex items-center gap-4 border-b border-[#2e3235] pb-4">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-700">
            <Image
              src={user?.imageUrl || "/default-avatar.png"}
              alt="User avatar"
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          </div>

          <input
            type="text"
            placeholder="What's happening?"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            className="flex-grow bg-transparent outline-none text-gray-200 placeholder-gray-500 text-base sm:text-lg"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
          <label
            className="relative flex items-center gap-2 text-gray-400 bg-[#1c1f22] border border-[#2e3235] rounded px-3 py-2 cursor-pointer hover:border-gray-500 transition w-max max-w-[200px]"
          >
            <AiOutlineFileAdd className="text-xl" />
            <span className="text-sm truncate max-w-[150px]">
              {file ? file.name : "Add Image"}
            </span>
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>

          <button
            type="submit"
            className="bg-white text-black font-semibold text-sm px-6 py-2 rounded-full hover:opacity-100 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </>
  );
};

export default CreatePost;

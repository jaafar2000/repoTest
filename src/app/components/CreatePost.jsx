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

        // Refetch posts and update parent

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
    <div className="border-b border-[#2e3235]">
      <p className="border-b border-[#2e3235] text-center py-7 text-2xl text-gray-300 uppercase font-semibold tracking-wide">
        Start a new post—share your ideas.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-5 px-5 w-[90%] mx-auto my-3 py-6 border-b border-[#2e3235]">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <Image
              src={user?.imageUrl || "/default-avatar.png"}
              alt="User avatar"
              width={100}
              height={100}
              className="object-cover w-full h-full"
            />
          </div>
          <input
            type="text"
            placeholder="What's happening?"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            className="flex-grow bg-transparent outline-none text-gray-200 placeholder-gray-500 text-lg"
          />
        </div>

        <div className="flex items-center w-[90%] mx-auto justify-between px-5 py-4">
          <div className="relative flex items-center gap-1 max-w-fit text-gray-400 bg-[#1c1f22] border border-[#2e3235] rounded px-2 py-1 cursor-pointer hover:border-gray-500 transition">
            <AiOutlineFileAdd className="text-2xl" /> {file ? "" : "Add Image"}
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => setFile(e.target.files[0])}
            />
            {file && (
              <span className="ml-2 text-gray-300 max-w-xs truncate">
                {file.name}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="bg-white text-black font-semibold px-6 py-2 rounded-3xl opacity-85 hover:opacity-100 transition"
            disabled={loading}
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;

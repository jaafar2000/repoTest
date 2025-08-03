"user client";
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

const CreateReply = ({ PostAuthor, postId, refreshReplies }) => {
  const { user } = useUser();
  const [text, setText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(postId);

    try {
      if (!postId) {
        console.error("Missing post ID for reply");
        return;
      }
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

      if (!res.ok) throw new Error(data?.message || "Failed to post");
      refreshReplies();
      console.log("Post created:", data);
      setText("");
    } catch (err) {
      console.error("Error from front end:", err.message);
    }
  };

  return (
    <div className=" border-[#2e3235]  border-b">
      <p className="px-10 pt-1 text-gray-500">
        {" "}
        Replying To <span className="text-blue-400">@{PostAuthor}</span>
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-row  items-center px-7 py-5 gap-3"
      >
        <div className="relative w-[50px] h-[50px] rounded-full overflow-hidden">
          <Image
            src={user?.imageUrl}
            width={100}
            height={100}
            alt="user Image"
              className="w-full h-full object-cover"
          />
        </div>
        <input
          type="text"
          placeholder="Post your reply"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="outline-none text-2xl font-light"
        />
        <button className="text-black ml-auto font-semibold bg-gray-300 hover:bg-white transition ease-in-out cursor-pointer px-2 h-fit py-1 rounded-3xl">
          Reply{" "}
        </button>
      </form>
    </div>
  );
};

export default CreateReply;

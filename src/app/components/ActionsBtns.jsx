import React from "react";
import { Heart, MessageCircle, Share2, Trash } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
const ActionsBtns = ({ post, delPost, callLikePost, likes }) => {
  const { user } = useUser();

  return (
    <div className="flex items-center justify-around  gap-8 mt-4 text-gray-400">
      <Link
        href={`/post/${post?._id}`}
        className="flex flex-row items-center justify-center gap-1"
      >
        <MessageCircle className=" cursor-pointer hover:text-blue-400" />
        {post?.comments}
      </Link>
      <button
        onClick={() => callLikePost()}
        className="flex flex-row items-center gap-1"
      >
        <Heart className={`w-5 h-5 cursor-pointer`} />
        {likes}
      </button>
      <Share2 className="w-5 h-5 cursor-pointer hover:text-green-400" />
      {post?.userId === user?.id && (
        <button onClick={() => delPost()} className="flex items-center">
          <Trash className={`w-5 h-5 cursor-pointer `} />{" "}
        </button>
      )}
    </div>
  );
};

export default ActionsBtns;

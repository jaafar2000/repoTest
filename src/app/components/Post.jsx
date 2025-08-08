"use client";

import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import ActionsBtns from "./ActionsBtns";
import Loader from "./Loader";

const Post = ({ post, onPostDeleted }) => {
  const { user } = useUser();
  const [likes, setLikes] = useState(post.likes?.length || 0);
  const [deleting, setDeleting] = useState(false);

  const likePost = async () => {
    try {
      const res = await fetch(`/api/posts/${post._id}/like`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ClerkId: user.id }),
      });

      if (!res.ok) throw new Error("Failed to like post");

      const data = await res.json();
      setLikes(data.likeCount);
    } catch (err) {
      console.error("Error liking post:", err.message);
    }
  };

  const DeletePost = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/posts/${post._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to delete post");

      if (onPostDeleted) onPostDeleted();
    } catch (err) {
      console.error("Error deleting post:", err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      {deleting && <Loader />}

      <Link href={`/post/${post?._id}`}>
        <div className="flex items-start pt-4  gap-3 mb-2">
          <div className="w-10 h-10 rounded-full overflow-hidden relative">
            <Image
              src={post?.user?.avatar || "/default-avatar.png"}
              alt="Avatar"
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-col w-full text-sm">
            <div className="flex flex-wrap gap-1 items-center text-white">
              <span className="font-medium">
                {post?.user?.firstName} {post?.user?.lastName}
              </span>
              <span className="text-gray-400">@{post?.user?.username}</span>
              <span className="text-gray-500 hidden sm:inline">•</span>
              <span className="text-gray-500">
                {post.createdAt
                  ? formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                    })
                  : "just now"}
              </span>
            </div>
{/* bg-[#121212] border-l-2 border-white */}
            {post?.postText && (
              <p className=" text-gray-300 text-sm leading-relaxed whitespace-pre-wrap  rounded-sm p-2   mt-5 ">
                {post.postText}
              </p>
            )}

            {post?.imageUrl && (
              <div className="relative mt-3 w-full h-80 sm:h-96 rounded-lg overflow-hidden border border-[#2e3235]">
                <Image
                  src={post.imageUrl}
                  alt="Post image"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 600px"
                />
              </div>
            )}
          </div>
        </div>
      </Link>

      <ActionsBtns
        delPost={DeletePost}
        callLikePost={likePost}
        post={post}
        likes={likes}
      />
    </>
  );
};

export default Post;

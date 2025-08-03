"use client";

import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import ActionsBtns from "./ActionsBtns";

const Post = ({ post, onPostDeleted }) => {
  const { user } = useUser();
  const [likes, setLikes] = useState(post.likes?.length || 0);
  const [deleting, setDeleting] = useState(false);

  const likePost = React.useCallback(async () => {
    try {
      const res = await fetch(`/api/posts/${post._id}/like`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ClerkId: user.id }),
      });

      if (!res.ok) throw new Error("Failed to like post");

      const data = await res.json();

      setLikes(data.likeCount);
    } catch (err) {
      console.error("Error liking post:", err.message);
    }
  }, [post._id, user.id]);

  const DeletePost = React.useCallback(async () => {
    setDeleting(true);

    try {
      const res = await fetch(`/api/posts/${post._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to delete post");

      // Trigger parent to re-fetch
      if (onPostDeleted) onPostDeleted();
    } catch (err) {
      console.error("Error deleting post:", err.message);
    } finally {
      setDeleting(false);
    }
  }, [post._id, onPostDeleted]);

  return (
    <>
      {deleting && <span className="loader "></span>}
      <Link href={`/post/${post?._id}`}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <Image
              src={post?.user?.avatar || "/default-avatar.png"}
              width={40}
              height={40}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 text-sm">
            <span className="font-semibold text-white">
              {post?.user?.firstName} {post?.user?.lastName}
            </span>
            <span className="text-gray-500">@{post?.user?.username}</span>
            <span className="hidden sm:inline text-gray-600">•</span>
            <span className="text-gray-500">
              <p className="text-gray-400 text-sm">
                {post.createdAt
                  ? formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                    })
                  : "just now"}
              </p>
            </span>
          </div>
        </div>

        {/* Post Text */}
        {post?.postText && (
          <p className="mt-3 text-sm text-gray-300 bg-[#121212] rounded-sm p-2 border-l-white border-l-2 leading-relaxed whitespace-pre-wrap">
            {post.postText}
          </p>
        )}
        {/* Post Image */}
        {post?.imageUrl && (
          <div className="relative mt-3 w-full h-96 rounded-lg overflow-hidden border border-[#2e3235]">
            <Image
              src={post.imageUrl}
              alt="Post image"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 600px"
            />
          </div>
        )}
      </Link>

      {/* Action Icons */}
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

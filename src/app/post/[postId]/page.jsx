"use client";

import Image from "next/image";
import React, { useEffect, useState, useCallback } from "react";
import { CircleArrowLeft, Heart, Trash } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import CreateReply from "@/app/components/CreateReply";
import { usePostActions } from "@/app/hook/usePostActions";
import ReplyCard from "@/app/components/ReplyCard";
import { useUser } from "@clerk/nextjs";
import { fetchPosts } from "@/lib/actions/fetchPosts";
const Page = () => {
  const router = useRouter(); // ✅ FIXED: router correctly defined
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);

  const { user } = useUser();

  const { likePost, deletePost, likes, liked, deleting } = usePostActions({
    postId,
    userId: user?.id,
    onDeleted: () => router.push("/"),
  });

  useEffect(() => {
    const fetchData = async () => {
      const posts = await fetchPosts();
      const foundPost = posts.find((p) => p._id === postId);
      setPost(foundPost);
    };

    if (postId) fetchData();
  }, [postId]);

  const fetchReplies = useCallback(async (id) => {
    if (!id) return;
    try {
      const res = await fetch(`/api/posts/${id}/replies`);
      if (!res.ok) {
        console.error("Failed to fetch replies");
        return;
      }
      const { replies } = await res.json();
      setReplies(replies);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }, []);

  useEffect(() => {
    if (post?._id) {
      fetchReplies(post._id);
    }
  }, [post?._id, fetchReplies]);

  return (
    <div
      id="middle"
      className="md:w-[50%] sm:w-[full] border-r max-h-screen overflow-scroll border-[#2e3235]"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <Link
        href="/"
        className="flex items-center border-[#2e3235] border-b text-white hover:text-gray-300 transition duration-200"
      >
        <div className="flex px-4 py-4 text-3xl gap-3.5">
          <CircleArrowLeft className="size-9" />
          Post
        </div>
      </Link>

      <div className="p-5 flex flex-row gap-4 items-center justify-start">
        <div className="relative w-[50px] h-[50px] rounded-full overflow-hidden">
          <Image
            src={post?.user?.avatar || "/default-avatar.png"}
            width={100}
            height={100}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-white">
            {post?.user?.firstName} {post?.user?.lastName}
          </span>
          <span className="text-gray-500">@{post?.user?.username}</span>
        </div>
      </div>

      {post?.postText && <p className="px-6">{post.postText}</p>}

      {post?.imageUrl && (
        <div className="relative mx-6 mt-5 h-[300px] w-[80%] border border-[#2e3235] rounded-lg overflow-hidden">
          <Image
            src={post.imageUrl}
            alt="Post image"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 600px"
          />
        </div>
      )}

      <div className="mx-6 py-3 text-gray-600 border-[#2e3235] border-b">
        {post?.createdAt &&
          format(new Date(post.createdAt), "hh:mm a . MMMM dd, yyyy")}
      </div>

      <div className="mx-6 py-3 flex flex-row justify-between text-gray-600 border-[#2e3235] border-b">
        <button onClick={likePost} className="flex items-center gap-1">
          <Heart className={liked ? "text-red-500" : ""} />
          <span>{likes}</span>
        </button>
        {post?.userId === user?.id && (
          <button
            onClick={deletePost}
            disabled={deleting}
            className="hover:text-red-500"
          >
            <Trash />
          </button>
        )}
      </div>

      <CreateReply
        refreshReplies={() => fetchReplies(post?._id)}
        postId={post?._id}
        PostAuthor={post?.user?.username}
      />

      {replies.length > 0 &&
        replies.map((rep) => (
          <div key={rep?._id}>
            <ReplyCard
              reply={rep}
              callFetch={() => fetchReplies(post?._id)}
              userName={post?.user?.username}
            />
          </div>
        ))}
    </div>
  );
};

export default Page;

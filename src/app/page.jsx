"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import { fetchPosts } from "@/lib/actions/fetchPosts";
import CreatePost from "./components/CreatePost";
import PostsFeed from "./components/PostsFeed";
import Link from "next/link";
import { usePostsStore } from "@/lib/actions/useStateStore";
export default function Home() {
  const setPostsNo = usePostsStore((state) => state.setPosts);

  const { user, isLoaded } = useUser();
  const [updatingIds, setUpdatingIds] = useState(new Set());

  const [posts, setPosts] = useState([]);
  const middleRef = useRef(null);

  useEffect(() => {
    if (!isLoaded || !user) return;

    fetchPosts()
      .then((data) => {
        setPosts(data);
        setPostsNo(data);
      })
      .catch((err) => console.error("Error in fetchPosts:", err.message));
  }, [isLoaded, user]);

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handlePostDeleted = async () => {
    const updatedPosts = await fetchPosts();
    setPosts(updatedPosts);
  };

  if (!isLoaded) return null;

  if (!user)
    return (
      <div className="lg:w-[50%] md:w-full flex flex-col items-center h-full justify-center border-t md:border-t-0 md:border-r border-[#2e3235] p-6">
        <p className="text-gray-400 text-center">
          Please sign in to view the feed.
        </p>
        <div className="md:block lg:hidden my-4 ">
          <Link href="/sign-in" onClick={() => setMenuOpen(false)}>
            <button className="text-white border border-[#2e3235] mb-3 w-full py-2 rounded">
              Sign In
            </button>
          </Link>
          <Link href="/sign-up" onClick={() => setMenuOpen(false)}>
            <button className="bg-gray-200 text-black w-full py-2 rounded">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    );

  return (
    <div
      id="middle"
      ref={middleRef}
      className="w-full md:w-2/3 lg:w-1/2 border-t md:border-t-0 md:border-r border-[#2e3235] overflow-y-auto"
      style={{
        scrollbarWidth: "none", // Firefox
      }}
    >
      <CreatePost onPostCreated={handlePostCreated} />
      <PostsFeed posts={posts} onPostDeleted={handlePostDeleted} />
    </div>
  );
}

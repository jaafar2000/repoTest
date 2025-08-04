"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import { fetchPosts } from "@/lib/actions/fetchPosts";
import CreatePost from "./components/CreatePost";
import PostsFeed from "./components/PostsFeed";

export default function Home() {
  const { user, isLoaded } = useUser();
  const [posts, setPosts] = useState([]);
  const middleRef = useRef(null);

  useEffect(() => {
    if (!isLoaded || !user) return;

    fetchPosts()
      .then((data) => {
        console.log("Fetched posts:", data);
        setPosts(data);
      })
      .catch((err) => console.error("Error in fetchPosts:", err.message));
  }, [isLoaded, user]);

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  // useEffect(() => {
  //   const onWheel = (e) => {
  //     if (middleRef.current) {
  //       middleRef.current.scrollTop += e.deltaY;
  //       e.preventDefault();
  //     }
  //   };
  //   window.addEventListener("wheel", onWheel, { passive: false });
  //   return () => window.removeEventListener("wheel", onWheel);
  // }, []);

  if (!isLoaded) return null;

  if (!user)
    return (
      <div
        className="w-full md:w-[50%] flex items-center justify-center border-r max-h-screen overflow-scroll border-[#2e3235]"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <p className="text-gray-400">Please sign in to view the feed.</p>
      </div>
    );

  const handlePostDeleted = async () => {
    const updatedPosts = await fetchPosts();
    setPosts(updatedPosts);
  };

  return (
    <div
      id="middle"
      ref={middleRef}
      className="w-full md:w-[50%] border-r h-full overflow-scroll border-[#2e3235]"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <CreatePost onPostCreated={handlePostCreated} />
      <PostsFeed posts={posts} onPostDeleted={handlePostDeleted} />
    </div>
  );
}

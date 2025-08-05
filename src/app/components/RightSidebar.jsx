"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import FollowSuggestions from "./FollowSuggestions";
import SearchBar from "./SearchBar";

const RightSidebar = () => {
  const [trending, setTrending] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const parent = "rightside"
  const fetchTrending = async () => {
    try {
      const res = await fetch("https://api.first.org/data/v1/news");
      if (!res.ok) throw new Error("Failed to fetch trending news");
      const json = await res.json();
      const newArr = json.data.slice(53, 56).map((item) => ({
        title: item.title,
        img: item.image || "/fallback-image.png",
        url: item.link,
        subreddit: "news",
      }));
      return newArr;
    } catch (err) {
      console.error("Failed to fetch trending:", err);
      return [];
    }
  };

  useEffect(() => {
    fetchTrending().then(setTrending);
  }, []);

  return (
    <aside className="flex flex-col gap-4 w-full sm:w-[full]">
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Trending */}
      <div className="border border-[#2e3235] rounded-xl p-4 space-y-4">
        <h3 className="font-bold text-lg">What’s happening</h3>
        {trending.length > 0 ? (
          trending.map((item, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-2 rounded hover:bg-[#2c2f33]"
            >
              <div className="w-[80px] h-[60px] overflow-hidden rounded-sm">
                <Image
                  src={item.img}
                  alt={item.title || "Trending"}
                  width={80}
                  height={60}
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="flex flex-col">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-sm line-clamp-2"
                >
                  {item.title}
                </a>
                <p className="text-gray-500 text-xs mt-1">r/{item.subreddit}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">Loading trending news...</p>
        )}
      </div>

      {/* Follow Suggestions */}
      <FollowSuggestions searchTerm={searchTerm} parent={parent} />
    </aside>
  );
};

export default RightSidebar;

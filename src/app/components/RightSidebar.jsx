"use client";

import React, { useEffect, useState } from "react";
import FollowSuggestions from "./FollowSuggestions";
import fetchTrending from "@/lib/actions/fetchTrending";

const RightSidebar = () => {
  const [trending, setTrending] = useState([]);
  const parent = "rightside";

  useEffect(() => {
    fetchTrending().then(setTrending);
  }, []);

  return (
    <aside className="flex flex-col gap-4 w-full sm:w-[full]">
      <h3 className="font-bold text-lg">What’s happening</h3>
      <div className="border border-[#2e3235] rounded-xl p-4 space-y-4">
        {trending.length > 0 ? (
          trending.map((item, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-2 rounded hover:bg-[#2c2f33]"
            >
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

      <FollowSuggestions parent={parent} />
    </aside>
  );
};

export default RightSidebar;

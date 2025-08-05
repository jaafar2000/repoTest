import React from "react";
import FollowSuggestions from "../components/FollowSuggestions";
import SearchBar from "../components/SearchBar";

const page = () => {
  const parent = "users"
  return (
    <div
      id="middle"
      className="w-full md:w-2/3 lg:w-1/2 border-t md:border-t-0 md:border-r border-[#2e3235] overflow-y-auto flex flex-col gap-3 mt-4 p-3 "
      style={{
        scrollbarWidth: "none", // Firefox
      }}
    >
      {" "}
      <SearchBar />
      <FollowSuggestions parent={parent}  />
    </div>
  );
};

export default page;

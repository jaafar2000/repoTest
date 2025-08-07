import React from "react";
import Image from "next/image";
import { format } from "date-fns";
import { usePostActions } from "../hook/usePostActions";
import { Trash } from "lucide-react";
import { useUser } from "@clerk/nextjs";

const ReplyCard = ({ reply, userName, callFetch }) => {
  const { deletePost, deleting } = usePostActions({ postId: reply?._id });
  const { user } = useUser();

  const {
    postText,
    createdAt,
    userId,
    user: replyUser = {},
  } = reply || {};

  const { avatar, firstName, lastName, username } = replyUser;

  const isOwner = user?.id === userId;

  return (
    <div className="flex items-start gap-4 px-4 py-4 border-b border-[#2e3235] relative">
      <div className="w-10 h-10 rounded-full overflow-hidden relative shrink-0">
        <Image
          src={avatar}
          alt="User Avatar"
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2 text-sm text-white">
          <span className="font-semibold">{firstName}</span>
          <span>{lastName}</span>
          {username && <span className="text-gray-400">@{username}</span>}
          {createdAt && (
            <span className="text-gray-500">
              • {format(new Date(createdAt), "MMM dd, yyyy • hh:mm a")}
            </span>
          )}
        </div>
        <p className="text-gray-300 mt-1 text-sm leading-relaxed">
          <span className="text-blue-400 mr-1">@{userName}</span>
          {postText}
        </p>
      </div>

      {isOwner && (
        <button
          className="text-gray-400 hover:text-red-500 transition"
          onClick={async () => {
            await deletePost();
            callFetch();
          }}
        >
          <Trash size={18} />
        </button>
      )}

      {deleting && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="loader" />
        </div>
      )}
    </div>
  );
};

export default ReplyCard;

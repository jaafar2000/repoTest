import React from "react";
import Image from "next/image";
import { format } from "date-fns";
import { usePostActions } from "../hook/usePostActions";
import { Trash } from "lucide-react";

const ReplyCard = ({ reply, userName, callFetch }) => {
  const { deletePost, deleting } = usePostActions({ postId: reply?._id });

  return (
    <div className="flex flex-col sm:flex-row gap-3 px-4 py-4 border-b border-[#2e3235] relative">
      {deleting && <div className="loader" />}
      <div className="w-10 h-10 rounded-full overflow-hidden relative shrink-0">
        <Image
          src={reply?.user?.avatar}
          alt="User Avatar"
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-1 text-sm text-white">
          <span className="font-medium">{reply?.user?.firstName}</span>
          <span>{reply?.user?.lastName}</span>
          <span className="text-gray-500">@{reply?.user?.username}</span>
          <span className="text-gray-600">
            {reply?.createdAt &&
              format(new Date(reply.createdAt), "MMM dd, yyyy • hh:mm a")}
          </span>
        </div>
        <p className="text-gray-300 mt-1 text-sm">
          <span className="text-blue-400 mr-1">@{userName}</span>
          {reply?.postText}
        </p>
      </div>

      <button
        className="absolute top-4 right-4"
        onClick={async () => {
          await deletePost();
          callFetch();
        }}
      >
        <Trash size={18} />
      </button>
    </div>
  );
};

export default ReplyCard;

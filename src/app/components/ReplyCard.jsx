import React from "react";
import Image from "next/image";
import { format } from "date-fns";
import { usePostActions } from "../hook/usePostActions";
import { Trash } from "lucide-react";
const ReplyCard = ({ reply, userName, callFetch }) => {
  const { deletePost, deleting } = usePostActions({
    postId: reply?._id,
  });
  return (
    <div className="flex  relative items-center  gap-2 pl-10 pr-5 py-5  border-b  border-[#2e3235] ">
      {deleting && <div className="loader" />}
      <div className="relative w-[40px] h-[40px] rounded-full   overflow-hidden">
        <Image
          src={reply?.user?.avatar}
          alt="asdfasdf"
          className="w-full h-full object-cover"
          width={100}
          height={100}
        />
      </div>
      <div>
        <div className="flex items-center gap-1">
          {" "}
          <span className="mr-1">{reply?.user?.firstName}</span>
          <span>{reply?.user?.lastName}</span>{" "}
          <span className="text-sm text-gray-600">
            @{reply?.user?.username}
          </span>
          <div className=" text-gray-600 text-sm ">
            {reply?.createdAt &&
              format(new Date(reply.createdAt), "MMMM dd, yyyy . hh:mm a ")}
          </div>
        </div>
        <p>
          {" "}
          <span className="text-blue-400 "> @{userName}</span> {reply?.postText}
        </p>
      </div>

      <button
        className="ml-auto"
        onClick={async () => {
          await deletePost();
          callFetch();
        }}
      >
        <Trash />
      </button>
    </div>
  );
};

export default ReplyCard;

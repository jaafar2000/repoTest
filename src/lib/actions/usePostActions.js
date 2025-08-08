import { useCallback, useState } from "react";

export const usePostActions = ({ postId, userId, onDeleted }) => {
  const [likes, setLikes] = useState(0); // optionally make this accept initial count
  const [liked, setLiked] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const likePost = useCallback(async () => {
    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ClerkId: userId }),
      });

      if (!res.ok) throw new Error("Failed to like post");

      const data = await res.json();
      setLikes(data.likeCount);
      setLiked(data.liked);
    } catch (err) {
      console.error("Like error:", err.message);
    }
  }, [postId, userId]);

  const deletePost = useCallback(async () => {
    setDeleting(true);
    console.log(postId)
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Delete failed");

      if (onDeleted) onDeleted(); // for example, redirect to homepage
    } catch (err) {
      console.error("Delete error:", err.message);
    } finally {
      setDeleting(false);
    }
  }, [postId, onDeleted]);

  return { likePost, deletePost, likes, liked, deleting };
};

import User from "@/lib/models/user.model";
import dbConnect from "@/lib/connectdb";
import Post from "@/lib/models/post.model";

export async function PATCH(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const { ClerkId } = await req.json();

    const user = await User.findOne({ clerkId: ClerkId });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    const post = await Post.findById(id);
    if (!post) {
      return new Response(JSON.stringify({ error: "Post not found" }), {
        status: 404,
      });
    }
    const userId = user._id.toString();
    const alreadyLiked = post.likes.some((uid) => uid.toString() === userId);

    if (alreadyLiked) {
      // Unlike
      post.likes = post.likes.filter((uid) => uid.toString() !== userId);
    } else {
      // Like
      post.likes.push(user._id);
    }
    await post.save();

    return new Response(
      JSON.stringify({
        liked: !alreadyLiked,
        likeCount: post.likes.length,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in PATCH:", err);
    return new Response(
      JSON.stringify({ error: "Failed to like post", message: err.message }),
      { status: 500 }
    );
  }
}

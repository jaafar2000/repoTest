import dbConnect from "@/lib/connectdb";
import Post from "@/lib/models/post.model";

export async function DELETE(req, context) {
  try {
    await dbConnect();
    const { id } = context.params;

    // Find the post first (to check if it's a reply)
    const post = await Post.findById(id);
    if (!post) {
      return new Response(JSON.stringify({ error: "Post not found" }), {
        status: 404,
      });
    }

    // Delete the post itself
    await Post.findByIdAndDelete(id);

    // If it's a main post, delete all replies
    if (!post.parentPostId) {
      await Post.deleteMany({ parentPostId: id });
    }

    // If it's a reply, decrement the parent's comment count
    if (post.parentPostId) {
      await Post.findByIdAndUpdate(post.parentPostId, {
        $inc: { comments: -1 },
      });
    }

    return new Response(JSON.stringify({ message: "Post deleted" }), {
      status: 200,
    });
  } catch (err) {
    console.error("Error in DELETE:", err);
    return new Response(
      JSON.stringify({ error: "Failed to delete post", message: err.message }),
      { status: 500 }
    );
  }
}


export async function GET(req, context) {
  const { id } = context.params;

  try {
    await dbConnect(); // await the DB connection
    const post = await Post.findById(id)
      .populate("userMongoId", "username firstName lastName avatar")
      .lean();

    if (!post) {
      return new Response(JSON.stringify({ error: "Post not found" }), {
        status: 404,
      });
    }

    // Format the post to include user as 'user'
    const formattedPost = {
      ...post,
      user: post.userMongoId,
    };

    return new Response(JSON.stringify({ post: formattedPost }), {
      status: 200,
    });
  } catch (err) {
    console.error("API GET /posts/[id] error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}

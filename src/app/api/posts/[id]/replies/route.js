import Post from "@/lib/models/post.model";
import User from "@/lib/models/user.model";
import dbConnect from "@/lib/connectdb";

export async function POST(req, { params }) {
  try {
    await dbConnect();

    const { id } = params; // ✅ valid
    const body = await req.json();
    const { postText, userId } = body;

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    const newPost = await Post.create({
      postText,
      parentPostId: id,
      userMongoId: user._id,
      userId: userId
    });
    await Post.findByIdAndUpdate(id, { $inc: { comments: 1 } });

    const populatedPost = await Post.findById(newPost._id)
      .populate("userMongoId", "username firstName lastName avatar")
      .lean();

    return new Response(
      JSON.stringify({
        message: "Post created",
        post: {
          ...populatedPost,
          user: populatedPost.userMongoId,
        },
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating post:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    const replies = await Post.find({ parentPostId: id })
      .populate("userMongoId", "username firstName lastName avatar")
      .lean();

    const formattedReplies = replies.map((reply) => ({
      ...reply,
      user: reply.userMongoId,
    }));

    return new Response(JSON.stringify({ replies: formattedReplies }), {
      status: 200,
    });
  } catch (err) {
    console.error("Error fetching replies:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}

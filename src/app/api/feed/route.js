import Post from "@/lib/models/post.model";
import dbConnect from "@/lib/connectdb";
import User from "@/lib/models/user.model";
export async function GET() {
  console.log("API /api/feed called");

  await dbConnect();
  console.log("DB connected");

  try {
    const posts = await Post.find({parentPostId:null})
      .sort({ createdAt: -1 })
      .populate("userMongoId", "username firstName lastName avatar")
      .lean();

    console.log("Posts found:", posts.length);

    const formattedPosts = posts.map((post) => ({
      ...post,
      user: post.userMongoId,
    }));

    return new Response(JSON.stringify(formattedPosts), { status: 200 });
  } catch (err) {
    console.error("Error in GET /api/feed:", err.message);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch posts sorry",
        message: err.message,
      }),
      { status: 500 }
    );
  }
}

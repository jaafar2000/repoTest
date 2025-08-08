import { v2 as cloudinary } from "cloudinary";
import dbConnect from "@/lib/connectdb";
import Post from "@/lib/models/post.model";
import User from "@/lib/models/user.model";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  await dbConnect();

  try {
    const formData = await req.formData();
    const postText = formData.get("postText");
    const userId = formData.get("userId");
    const file = formData.get("file");

    if (!postText || !userId) {
      return new Response(
        JSON.stringify({ error: "postText and userId are required" }),
        { status: 400 }
      );
    }

    // Step 1: Find the Mongo user
    const mongoUser = await User.findOne({ clerkId: userId });
    if (!mongoUser) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    // Step 2: Convert file to base64 and upload
    let imageUrl = null;
    if (file instanceof Blob) {
      const arrayBuffer = await file.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      const mimeType = file.type;
      const dataUri = `data:${mimeType};base64,${base64}`;

      const uploadResult = await cloudinary.uploader.upload(dataUri, {
        folder: "posts",
      });

      imageUrl = uploadResult.secure_url;
    }

    // Step 3: Create the post
    const newPost = await Post.create({
      postText,
      userId, // Clerk ID
      userMongoId: mongoUser._id, // Mongo ref
      imageUrl,
    });

    const populatedPost = await Post.findById(newPost._id)
      .populate("userMongoId", "username firstName lastName avatar")
      .lean();

    return new Response(
      JSON.stringify({
        message: "Post created",
        post: {
          ...populatedPost,
          user: populatedPost.userMongoId, // ✅ include populated user
        },
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("POST error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error.message,
      }),
      { status: 500 }
    );
  }
}


export async function GET() {

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

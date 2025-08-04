import dbConnect from "@/lib/connectdb";
import User from "@/lib/models/user.model";
export async function POST(req) {
  try {
    await dbConnect();

    const { userId, userToFollow } = await req.json();

    if (!userId || !userToFollow) {
      return new Response(JSON.stringify({ msg: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });

    const user = await User.findOne({ clerkId: userId });
    const userFollowed = await User.findById(userToFollow);

    if (!user || !userFollowed) {
      return new Response(JSON.stringify({ msg: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const isAlreadyFollowing = user.following.some(
      (id) => id.toString() === userToFollow
    );

    if (isAlreadyFollowing) {
      // Unfollow
      user.following = user.following.filter(
        (id) => id.toString() !== userToFollow
      );
      userFollowed.followers = userFollowed.followers.filter(
        (id) => id.toString() !== user._id.toString()
      );
    } else {
      // Follow
      user.following.push(userToFollow);
      userFollowed.followers.push(user._id);
    }

    await user.save();
    await userFollowed.save();

    return new Response(
      JSON.stringify({
        success: true,
        action: isAlreadyFollowing ? "unfollowed" : "followed",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Follow API error:", err);
    return new Response(
      JSON.stringify({ message: err.message || "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

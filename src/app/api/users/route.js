import dbConnect from "@/lib/connectdb";
import User from "@/lib/models/user.model";

export async function GET(req) {
  await dbConnect();

  const url = new URL(req.url);
  const currentUserId = url.searchParams.get("currentUserId");

  if (!currentUserId) {
    return new Response(
      JSON.stringify({ message: "Missing currentUserId query parameter" }),
      { status: 400 }
    );
  }

  // Fetch current user to get following list
  const currentUser = await User.findOne({ clerkId: currentUserId }).lean();

  if (!currentUser) {
    return new Response(
      JSON.stringify({ message: "Current user not found" }),
      { status: 404 }
    );
  }

  // Fetch all users
  const users = await User.find().lean();

  // Map and add isFollowing flag
  const usersWithFollowing = users.map((user) => {
    const isFollowing = currentUser.following.some(
      (id) => id.toString() === user._id.toString()
    );
    return { ...user, isFollowing };
  });

  return new Response(JSON.stringify(usersWithFollowing), { status: 200 });
}

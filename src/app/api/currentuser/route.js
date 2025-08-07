import dbConnect from "@/lib/connectdb";
import User from "@/lib/models/user.model";

export async function GET(req) {
  await dbConnect();
  const url = new URL(req.url);
  const currentUserId = url.searchParams.get("currentUserId");
  console.log("asdfiasnfdknasdnfoiansoifdnasiodnfnias");
  console.log(currentUserId);
  if (!currentUserId) {
    return new Response(
      JSON.stringify({ message: "Missing currentUserId query parameter" }),
      { status: 400 }
    );
    a;
  }

  // Fetch current user to get following list
  const currentUser = await User.findOne({ clerkId: currentUserId }).lean();

  if (!currentUser) {
    return new Response(JSON.stringify({ message: "Current user not found" }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify(currentUser), { status: 200 });
}

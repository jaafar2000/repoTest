import dbConnect from "@/lib/connectdb";
import User from "@/lib/models/user.model";
export async function GET() {
  await dbConnect();
  const users = await User.find();
  if (!users || users.length === 0) {
    return new Response(JSON.stringify({ message: "No user found" }), {
      status: 404,
    });
  }
  return new Response(JSON.stringify(users), { status: 200 });
}

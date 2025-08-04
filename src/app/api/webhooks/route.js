import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { createOrUpdateUser, deleteUser } from "@/lib/actions/user";

export const config = {
  api: {
    bodyParser: false, // Required for Clerk webhook verification
  },
};

export async function POST(req) {
  try {
    const evt = await verifyWebhook(req, {
      secret: process.env.CLERK_WEBHOOK_SECRET,
    });

    const { id } = evt.data;
    const eventType = evt.type;
    console.log(`Received webhook with ID ${id} and event type of ${eventType}`);
    console.log("Webhook payload:", evt.data);

    if (eventType === "user.created" || eventType === "user.updated") {
      const {
        id,
        first_name,
        last_name,
        image_url,
        email_addresses,
        username,
        primary_email_address_id, // ✅ FIXED: this is now included
      } = evt?.data;

      try {
        await createOrUpdateUser(
          id,
          first_name,
          last_name,
          username,
          image_url,
          email_addresses,
          primary_email_address_id
        );
        return new Response("User is created or updated", {
          status: 200,
        });
      } catch (error) {
        console.error("Error creating or updating user:", error);
        return new Response("Error occurred", {
          status: 400,
        });
      }
    }

    if (eventType === "user.deleted") {
      const { id } = evt?.data;
      try {
        await deleteUser(id);
        return new Response("User is deleted", {
          status: 200,
        });
      } catch (error) {
        console.error("Error deleting user:", error);
        return new Response("Error occurred", {
          status: 400,
        });
      }
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}

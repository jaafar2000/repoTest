import User from "../models/user.model";
import dbConnect from "../connectdb";
/**
 * Create or update a user in MongoDB from Clerk webhook data
 */ export const createOrUpdateUser = async (
  id,
  first_name,
  last_name,
  username,
  image_url,
  email_addresses,
  primary_email_address_id
) => {
  try {
    await dbConnect();

    const primaryEmailObj = email_addresses.find(
      (e) => e.id === primary_email_address_id
    );
    const email = primaryEmailObj?.email_address || null;

    const user = await User.findOneAndUpdate(
      { clerkId: id },
      {
        $set: {
          clerkId: id,
          firstName: first_name || null,
          lastName: last_name || null,
          avatar: image_url || null,
          email: email,
          username: username || null,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    return user;
  } catch (error) {
    console.error("❌ Error creating or updating user:", error);
    throw error;
  }
};


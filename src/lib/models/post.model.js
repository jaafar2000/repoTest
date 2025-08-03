import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    postText: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: false,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
    ],
    comments: {
      type: Number,
      default: 0,
    },
    userId: {
      type: String,
    },
    userMongoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    parentPostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);

export default Post;

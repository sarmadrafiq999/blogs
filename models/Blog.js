import mongoose, { Schema } from "mongoose";

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    images: [String],
    authorId: {
      type: String,
      required: true,
    },
    authorName: {
      type: String,
      default: "Anonymous",
    },
    likes: {
      type: [String], // array of user IDs
      default: [],
    },
    dislikes: {
      type: [String], // array of user IDs
      default: [],
    },
    comments: [
      {
        userId: String,
        userName: String,
        text: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    category: {
      type: String,
      required: true,
    },

  },
  { timestamps: true }
);

export default mongoose.models.Blog || mongoose.model("Blog", blogSchema);

import mongoose from "mongoose";
import type { HttpError } from "../utils/interfaces.js";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    status: { type: String, default: "Active platform node." },
    role: {
      type: String,
      enum: {
        values: ["user", "editor", "admin"],
        message: "{VALUE} is not a valid user role.",
      },
      default: "user",
    },
    isVerified: { type: Boolean, default: false },
    passwordResetToken: { type: String },
    passwordResetExpiry: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual binding to prevent arrays tracking memory bounds
userSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "creator",
});

// Middleware Cascade: Purge all dependencies if a profile is deleted
userSchema.pre("findOneAndDelete", async function (next) {
  try {
    const user = await this.model.findOne(this.getQuery());

    if (user) {
      const posts = await mongoose.model("Post").find({ creator: user._id });

      if (posts.length > 0) {
        const { clearImage } = await import("../utils/file-upload.js");

        const deletionPromises = posts
          .filter((post) => post.imageURL)
          .map((post) => clearImage(post.imageURL));

        // Wait for all file deletions to finish simultaneously
        await Promise.all(deletionPromises);

        await mongoose.model("Post").deleteMany({ creator: user._id });
      }
    }
    next();
  } catch (error) {
    next(error as HttpError);
  }
});

export default mongoose.model("User", userSchema);

import mongoose from "mongoose";

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
  const user = await this.model.findOne(this.getQuery());
  if (user) {
    const posts = await mongoose.model("Post").find({ creator: user._id });
    const { clearImage } = await import("../utils/file-upload.js");
    for (const post of posts) {
      if (post.imageURL) clearImage(post.imageURL);
    }
    await mongoose.model("Post").deleteMany({ creator: user._id });
  }
  next();
});

export default mongoose.model("User", userSchema);

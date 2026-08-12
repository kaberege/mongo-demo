import mongoose, { Schema, Model, Document, Types } from "mongoose";

export interface IPost extends Document {
  _id: Types.ObjectId;
  title: string;
  content: string;
  imageURL: string;
  creator: Types.ObjectId; // References the User document _id
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, trim: true, index: "text" },
    content: { type: String, required: true, trim: true, index: "text" },
    imageURL: { type: String, required: true },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

export const Post: Model<IPost> = mongoose.model<IPost>("Post", postSchema);

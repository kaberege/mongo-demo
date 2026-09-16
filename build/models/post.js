import mongoose, { Schema, Model, Document, Types } from "mongoose";
const postSchema = new Schema({
    title: { type: String, required: true, trim: true, index: "text" },
    content: { type: String, required: true, trim: true, index: "text" },
    imageURL: { type: String, required: true },
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
}, { timestamps: true });
export const Post = mongoose.model("Post", postSchema);
//# sourceMappingURL=post.js.map
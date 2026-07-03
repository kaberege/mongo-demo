import mongoose from "mongoose";

const Schema = mongoose.Schema;

const tokenBlacklistSchema = new Schema({
  token: { type: String, required: true, index: true },
  createdAt: { type: Date, default: Date.now, expires: "1h" },
});

export default mongoose.model("TokenBlacklist", tokenBlacklistSchema);

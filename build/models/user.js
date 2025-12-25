import mongoose from "mongoose";
const Schema = mongoose.Schema;
const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "I am new!",
    },
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: "Post",
        },
    ],
});
export default mongoose.model("User", userSchema);
//# sourceMappingURL=user.js.map
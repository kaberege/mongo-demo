import { Model, Document, Types } from "mongoose";
export interface IPost extends Document {
    _id: Types.ObjectId;
    title: string;
    content: string;
    imageURL: string;
    creator: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Post: Model<IPost>;
//# sourceMappingURL=post.d.ts.map
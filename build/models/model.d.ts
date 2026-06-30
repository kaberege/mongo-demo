import mongoose from "mongoose";
declare const _default: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    creator: mongoose.Types.ObjectId;
    title: string;
    content: string;
    imageURL: string;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    creator: mongoose.Types.ObjectId;
    title: string;
    content: string;
    imageURL: string;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    creator: mongoose.Types.ObjectId;
    title: string;
    content: string;
    imageURL: string;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    creator: mongoose.Types.ObjectId;
    title: string;
    content: string;
    imageURL: string;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    creator: mongoose.Types.ObjectId;
    title: string;
    content: string;
    imageURL: string;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    creator: mongoose.Types.ObjectId;
    title: string;
    content: string;
    imageURL: string;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default _default;
//# sourceMappingURL=model.d.ts.map
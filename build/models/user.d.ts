import mongoose from "mongoose";
declare const _default: mongoose.Model<{
    email: string;
    name: string;
    password: string;
    status: string;
    posts: mongoose.Types.ObjectId[];
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    email: string;
    name: string;
    password: string;
    status: string;
    posts: mongoose.Types.ObjectId[];
}> & {
    email: string;
    name: string;
    password: string;
    status: string;
    posts: mongoose.Types.ObjectId[];
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    email: string;
    name: string;
    password: string;
    status: string;
    posts: mongoose.Types.ObjectId[];
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    email: string;
    name: string;
    password: string;
    status: string;
    posts: mongoose.Types.ObjectId[];
}>> & mongoose.FlatRecord<{
    email: string;
    name: string;
    password: string;
    status: string;
    posts: mongoose.Types.ObjectId[];
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default _default;
//# sourceMappingURL=user.d.ts.map
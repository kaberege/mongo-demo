import mongoose from "mongoose";
declare const _default: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    email: string;
    name: string;
    password: string;
    status: string;
    role: "user" | "editor" | "admin";
    isVerified: boolean;
    passwordResetToken?: string | null;
    passwordResetExpiry?: NativeDate | null;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    email: string;
    name: string;
    password: string;
    status: string;
    role: "user" | "editor" | "admin";
    isVerified: boolean;
    passwordResetToken?: string | null;
    passwordResetExpiry?: NativeDate | null;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    email: string;
    name: string;
    password: string;
    status: string;
    role: "user" | "editor" | "admin";
    isVerified: boolean;
    passwordResetToken?: string | null;
    passwordResetExpiry?: NativeDate | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    toJSON: {
        virtuals: true;
    };
    toObject: {
        virtuals: true;
    };
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    email: string;
    name: string;
    password: string;
    status: string;
    role: "user" | "editor" | "admin";
    isVerified: boolean;
    passwordResetToken?: string | null;
    passwordResetExpiry?: NativeDate | null;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    email: string;
    name: string;
    password: string;
    status: string;
    role: "user" | "editor" | "admin";
    isVerified: boolean;
    passwordResetToken?: string | null;
    passwordResetExpiry?: NativeDate | null;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    email: string;
    name: string;
    password: string;
    status: string;
    role: "user" | "editor" | "admin";
    isVerified: boolean;
    passwordResetToken?: string | null;
    passwordResetExpiry?: NativeDate | null;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default _default;
//# sourceMappingURL=user.d.ts.map
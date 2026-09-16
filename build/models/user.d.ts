import mongoose, { Document, Model } from "mongoose";
import type { UserRole } from "../utils/interfaces.js";
export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    email: string;
    password: string;
    name: string;
    status: string;
    role: UserRole;
    isVerified: boolean;
    passwordResetToken?: string | null;
    passwordResetExpiry?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
export declare const User: Model<IUser>;
//# sourceMappingURL=user.d.ts.map
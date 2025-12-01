import { Document } from "mongoose";
export interface IUser extends Document {
    name: string;
    email: string;
    passwordHash: string;
    gender?: string;
    heightCm?: number;
    weightKg?: number;
}
export declare const User: import("mongoose").Model<IUser, {}, {}, {}, Document<unknown, {}, IUser, {}, import("mongoose").DefaultSchemaOptions> & IUser & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any, IUser>;
//# sourceMappingURL=User.d.ts.map
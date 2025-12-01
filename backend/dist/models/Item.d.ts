import { Document, Types } from "mongoose";
export interface IItem extends Document {
    owner: Types.ObjectId;
    title: string;
    description?: string;
    category?: string;
    size?: string;
    genderTarget?: string;
    dailyPrice: number;
    depositAmount?: number;
    condition?: string;
    available: boolean;
    images: string[];
}
export declare const Item: import("mongoose").Model<IItem, {}, {}, {}, Document<unknown, {}, IItem, {}, import("mongoose").DefaultSchemaOptions> & IItem & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any, IItem>;
//# sourceMappingURL=Item.d.ts.map
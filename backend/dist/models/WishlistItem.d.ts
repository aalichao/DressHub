import { Document, Types } from "mongoose";
export interface IWishlistItem extends Document {
    user: Types.ObjectId;
    item: Types.ObjectId;
}
export declare const WishlistItem: import("mongoose").Model<IWishlistItem, {}, {}, {}, Document<unknown, {}, IWishlistItem, {}, import("mongoose").DefaultSchemaOptions> & IWishlistItem & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any, IWishlistItem>;
//# sourceMappingURL=WishlistItem.d.ts.map
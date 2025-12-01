import { Document, Types } from "mongoose";
export interface ICartItem extends Document {
    user: Types.ObjectId;
    item: Types.ObjectId;
    rentalStart: Date;
    rentalEnd: Date;
    checkedOut: boolean;
}
export declare const CartItem: import("mongoose").Model<ICartItem, {}, {}, {}, Document<unknown, {}, ICartItem, {}, import("mongoose").DefaultSchemaOptions> & ICartItem & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any, ICartItem>;
//# sourceMappingURL=CartItem.d.ts.map
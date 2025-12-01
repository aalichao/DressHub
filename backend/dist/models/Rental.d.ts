import { Document, Types } from "mongoose";
export interface IRental extends Document {
    item: Types.ObjectId;
    owner: Types.ObjectId;
    renter: Types.ObjectId;
    startDate: Date;
    endDate: Date;
    totalPrice: number;
    status: "pending" | "confirmed" | "in_use" | "returned" | "canceled";
}
export declare const Rental: import("mongoose").Model<IRental, {}, {}, {}, Document<unknown, {}, IRental, {}, import("mongoose").DefaultSchemaOptions> & IRental & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any, IRental>;
//# sourceMappingURL=Rental.d.ts.map
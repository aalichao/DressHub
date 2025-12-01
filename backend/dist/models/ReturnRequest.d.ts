import { Document, Types } from "mongoose";
export interface IReturnRequest extends Document {
    rental: Types.ObjectId;
    renter: Types.ObjectId;
    owner: Types.ObjectId;
    status: "initiated" | "in_transit" | "received" | "issue_reported";
}
export declare const ReturnRequest: import("mongoose").Model<IReturnRequest, {}, {}, {}, Document<unknown, {}, IReturnRequest, {}, import("mongoose").DefaultSchemaOptions> & IReturnRequest & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any, IReturnRequest>;
//# sourceMappingURL=ReturnRequest.d.ts.map
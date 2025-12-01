import { Schema, model, Document, Types } from "mongoose";

export interface IReturnRequest extends Document {
  rental: Types.ObjectId;
  renter: Types.ObjectId;
  owner: Types.ObjectId;
  status: "initiated" | "in_transit" | "received" | "issue_reported";
}

const returnSchema = new Schema<IReturnRequest>({
  rental: { type: Schema.Types.ObjectId, ref: "Rental", required: true },
  renter: { type: Schema.Types.ObjectId, ref: "User", required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["initiated", "in_transit", "received", "issue_reported"],
    default: "initiated"
  },
}, { timestamps: true });

export const ReturnRequest = model<IReturnRequest>("ReturnRequest", returnSchema);

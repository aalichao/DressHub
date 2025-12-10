import { Schema, model, Document, Types } from "mongoose";

export interface IReturnRequest extends Document {
  rental: Types.ObjectId;
  renter: Types.ObjectId;
  owner: Types.ObjectId;
  status: "requested" | "approved" | "declined" | "in_transit" | "completed";
}

const returnSchema = new Schema<IReturnRequest>({
  rental: { type: Schema.Types.ObjectId, ref: "Rental", required: true },
  renter: { type: Schema.Types.ObjectId, ref: "User", required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["requested", "approved", "declined", "in_transit", "completed"],
    default: "requested"
  },
}, { timestamps: true });

export const ReturnRequest = model<IReturnRequest>("ReturnRequest", returnSchema);

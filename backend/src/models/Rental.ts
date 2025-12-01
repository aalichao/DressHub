import { Schema, model, Document, Types } from "mongoose";

export interface IRental extends Document {
  item: Types.ObjectId;
  owner: Types.ObjectId;
  renter: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: "pending" | "confirmed" | "in_use" | "returned" | "canceled";
}

const rentalSchema = new Schema<IRental>({
  item: { type: Schema.Types.ObjectId, ref: "Item", required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  renter: { type: Schema.Types.ObjectId, ref: "User", required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "confirmed", "in_use", "returned", "canceled"],
    default: "pending"
  }
}, { timestamps: true });

export const Rental = model<IRental>("Rental", rentalSchema);

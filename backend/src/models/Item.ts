import { Schema, model, Document, Types } from "mongoose";

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

const itemSchema = new Schema<IItem>({
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: String,
  category: String,
  size: String,
  genderTarget: String,
  dailyPrice: { type: Number, required: true },
  depositAmount: Number,
  condition: String,
  available: { type: Boolean, default: true },
  images: [String],
}, { timestamps: true });

export const Item = model<IItem>("Item", itemSchema);

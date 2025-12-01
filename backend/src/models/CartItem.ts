import { Schema, model, Document, Types } from "mongoose";

export interface ICartItem extends Document {
  user: Types.ObjectId;
  item: Types.ObjectId;
  rentalStart: Date;
  rentalEnd: Date;
  checkedOut: boolean;
}

const cartItemSchema = new Schema<ICartItem>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  item: { type: Schema.Types.ObjectId, ref: "Item", required: true },
  rentalStart: { type: Date, required: true },
  rentalEnd: { type: Date, required: true },
  checkedOut: { type: Boolean, default: false },
}, { timestamps: true });

export const CartItem = model<ICartItem>("CartItem", cartItemSchema);

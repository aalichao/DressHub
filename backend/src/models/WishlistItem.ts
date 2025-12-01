import { Schema, model, Document, Types } from "mongoose";

export interface IWishlistItem extends Document {
  user: Types.ObjectId;
  item: Types.ObjectId;
}

const wishlistItemSchema = new Schema<IWishlistItem>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  item: { type: Schema.Types.ObjectId, ref: "Item", required: true },
}, { timestamps: true });

wishlistItemSchema.index({ user: 1, item: 1 }, { unique: true });

export const WishlistItem = model<IWishlistItem>("WishlistItem", wishlistItemSchema);

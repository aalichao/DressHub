import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  gender?: string;
  heightCm?: number;
  weightKg?: number;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  gender: String,
  heightCm: Number,
  weightKg: Number,
}, { timestamps: true });

export const User = model<IUser>("User", userSchema);

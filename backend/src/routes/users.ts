import express from "express";
import { z } from "zod";
import { validate } from "../middleware/validate";
import { User } from "../models/User";

const router = express.Router();

const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    gender: z.string().optional(),
    heightCm: z.number().optional(),
    weightKg: z.number().optional(),
  }),
});

router.get("/me", async (req, res) => {
  const userId = (req as any).userId;
  const user = await User.findById(userId).select("-passwordHash");
  res.json(user);
});

router.put("/me", validate(updateProfileSchema), async (req, res) => {
  const userId = (req as any).userId;
  const updates = (req as any).parsed.body;

  const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select("-passwordHash");
  res.json(user);
});

export default router;

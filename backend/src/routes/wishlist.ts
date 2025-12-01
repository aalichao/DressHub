import express from "express";
import { z } from "zod";
import { validate } from "../middleware/validate";
import { WishlistItem } from "../models/WishlistItem";

const router = express.Router();

const wishlistSchema = z.object({
  body: z.object({
    itemId: z.string(),
  }),
});

router.post("/", validate(wishlistSchema), async (req, res) => {
  const { itemId } = (req as any).parsed.body;
  const userId = (req as any).userId;

  const item = await WishlistItem.findOneAndUpdate(
    { user: userId, item: itemId },
    { user: userId, item: itemId },
    { upsert: true, new: true }
  );

  res.status(201).json(item);
});

router.get("/", async (req, res) => {
  const userId = (req as any).userId;
  const items = await WishlistItem.find({ user: userId }).populate("item");
  res.json(items);
});

router.delete("/:itemId", async (req, res) => {
  const userId = (req as any).userId;
  const { itemId } = req.params;
  await WishlistItem.findOneAndDelete({ user: userId, item: itemId });
  res.status(204).send();
});

export default router;

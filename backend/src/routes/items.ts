import express from "express";
import { z } from "zod";
import { validate } from "../middleware/validate";
import { Item } from "../models/Item";

const router = express.Router();

const searchItemsSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  size: z.string().optional(),
  genderTarget: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
});

router.get("/", validate(searchItemsSchema), async (req, res) => {
  const { query, category, size, genderTarget, minPrice, maxPrice } = (req as any).parsed.query;

  const q: any = { available: true };

  if (query) {
    q.$or = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ];
  }
  if (category) q.category = category;
  if (size) q.size = size;
  if (genderTarget) q.genderTarget = genderTarget;

  if (minPrice || maxPrice) {
    q.dailyPrice = {};
    if (minPrice) q.dailyPrice.$gte = Number(minPrice);
    if (maxPrice) q.dailyPrice.$lte = Number(maxPrice);
  }

  const items = await Item.find(q).limit(50);
  res.json(items);
});

export default router;

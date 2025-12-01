import express from "express";
import { z } from "zod";
import { validate } from "../middleware/validate";
import { CartItem } from "../models/CartItem";
import { Rental } from "../models/Rental";

const router = express.Router();

const checkoutSchema = z.object({
  body: z.object({
    cartItemIds: z.array(z.string()),
  }),
});

router.post("/checkout", validate(checkoutSchema), async (req, res) => {
  const { cartItemIds } = (req as any).parsed.body;
  const userId = (req as any).userId;

  const cartItems = await CartItem.find({
    _id: { $in: cartItemIds },
    user: userId,
    checkedOut: false,
  }).populate("item");

  const rentals = [];

  for (const ci of cartItems) {
    const item: any = ci.item;
    const days =
      (new Date(ci.rentalEnd).getTime() - new Date(ci.rentalStart).getTime()) /
      (1000 * 60 * 60 * 24);

    const totalPrice = item.dailyPrice * Math.max(days, 1);

    const rental = await Rental.create({
      item: item._id,
      owner: item.owner,
      renter: userId,
      startDate: ci.rentalStart,
      endDate: ci.rentalEnd,
      totalPrice,
      status: "confirmed",
    });

    ci.checkedOut = true;
    await ci.save();

    rentals.push(rental);
  }

  res.status(201).json(rentals);
});

router.get("/", async (req, res) => {
  const userId = (req as any).userId;
  const role = req.query.role;

  const filter: any = {};
  if (role === "owner") filter.owner = userId;
  else filter.renter = userId;

  const rentals = await Rental.find(filter).populate("item");
  res.json(rentals);
});

export default router;

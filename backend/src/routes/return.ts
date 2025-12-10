import express from "express";
import { z } from "zod";
import { validate } from "../middleware/validate";
import { ReturnRequest } from "../models/ReturnRequest";
import { Rental } from "../models/Rental";
import { Item } from "../models/Item";

const router = express.Router();

const createReturnSchema = z.object({
  body: z.object({
    rentalId: z.string(),
  }),
});

router.post("/", validate(createReturnSchema), async (req, res) => {
  const { rentalId } = (req as any).parsed.body;
  const userId = (req as any).userId;

  const rental = await Rental.findById(rentalId);
  if (!rental) return res.status(404).json({ message: "Rental not found" });
  if (String(rental.renter) !== userId)
    return res.status(403).json({ message: "Not renter" });

  // Check if return request already exists
  const existing = await ReturnRequest.findOne({ rental: rentalId });
  if (existing) return res.status(400).json({ message: "Return request already exists" });

  const rr = await ReturnRequest.create({
    rental: rentalId,
    renter: rental.renter,
    owner: rental.owner,
    status: "requested",
  });

  res.status(201).json(rr);
});

const updateReturnSchema = z.object({
  body: z.object({
    status: z.enum(["requested", "approved", "declined", "in_transit", "completed"]),
  }),
});

router.put("/:id", validate(updateReturnSchema), async (req, res) => {
  const { id } = req.params;
  const { status } = (req as any).parsed.body;
  const userId = (req as any).userId;

  const rr = await ReturnRequest.findById(id);
  if (!rr) return res.status(404).json({ message: "Return not found" });

  // Only owner can approve or decline
  if ((status === "approved" || status === "declined") && String(rr.owner) !== userId) {
    return res.status(403).json({ message: "Only owner can approve or decline" });
  }

  // Only renter can set to in_transit (and only when status is approved)
  if (status === "in_transit") {
    if (String(rr.renter) !== userId) {
      return res.status(403).json({ message: "Only renter can mark as shipped" });
    }
    if (rr.status !== "approved") {
      return res.status(400).json({ message: "Can only mark as shipped when status is approved" });
    }
  }

  // Only owner can set to completed (and only when status is in_transit)
  if (status === "completed") {
    if (String(rr.owner) !== userId) {
      return res.status(403).json({ message: "Only owner can accept package" });
    }
    if (rr.status !== "in_transit") {
      return res.status(400).json({ message: "Can only accept package when status is in_transit" });
    }
  }

  rr.status = status;
  await rr.save();

  // Only mark item as available when return is completed
  if (status === "completed") {
    const rental = await Rental.findByIdAndUpdate(rr.rental, { status: "returned" });
    // Mark item as available again
    if (rental) {
      await Item.findByIdAndUpdate(rental.item, { available: true });
    }
  }

  res.json(rr);
});

router.get("/", async (req, res) => {
  const userId = (req as any).userId;
  const role = req.query.role;

  const filter: any = {};
  if (role === "owner") filter.owner = userId;
  else filter.renter = userId;

  const returns = await ReturnRequest.find(filter).populate({
    path: "rental",
    populate: {
      path: "item",
      select: "title"
    }
  });
  res.json(returns);
});

export default router;

import express from "express";
import { z } from "zod";
import { validate } from "../middleware/validate";
import { ReturnRequest } from "../models/ReturnRequest";
import { Rental } from "../models/Rental";

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

  const rr = await ReturnRequest.create({
    rental: rentalId,
    renter: rental.renter,
    owner: rental.owner,
  });

  res.status(201).json(rr);
});

const updateReturnSchema = z.object({
  body: z.object({
    status: z.enum(["initiated", "in_transit", "received", "issue_reported"]),
  }),
});

router.put("/:id", validate(updateReturnSchema), async (req, res) => {
  const { id } = req.params;
  const { status } = (req as any).parsed.body;
  const userId = (req as any).userId;

  const rr = await ReturnRequest.findById(id);
  if (!rr) return res.status(404).json({ message: "Return not found" });

  // You can add logic: only renter can set to in_transit; owner to received, etc.
  rr.status = status;
  await rr.save();

  if (status === "received") {
    await Rental.findByIdAndUpdate(rr.rental, { status: "returned" });
  }

  res.json(rr);
});

router.get("/", async (req, res) => {
  const userId = (req as any).userId;
  const role = req.query.role;

  const filter: any = {};
  if (role === "owner") filter.owner = userId;
  else filter.renter = userId;

  const returns = await ReturnRequest.find(filter).populate("rental");
  res.json(returns);
});

export default router;

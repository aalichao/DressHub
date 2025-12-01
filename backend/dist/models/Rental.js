"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rental = void 0;
const mongoose_1 = require("mongoose");
const rentalSchema = new mongoose_1.Schema({
    item: { type: mongoose_1.Schema.Types.ObjectId, ref: "Item", required: true },
    owner: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    renter: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    status: {
        type: String,
        enum: ["pending", "confirmed", "in_use", "returned", "canceled"],
        default: "pending"
    }
}, { timestamps: true });
exports.Rental = (0, mongoose_1.model)("Rental", rentalSchema);
//# sourceMappingURL=Rental.js.map
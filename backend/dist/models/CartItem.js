"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartItem = void 0;
const mongoose_1 = require("mongoose");
const cartItemSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    item: { type: mongoose_1.Schema.Types.ObjectId, ref: "Item", required: true },
    rentalStart: { type: Date, required: true },
    rentalEnd: { type: Date, required: true },
    checkedOut: { type: Boolean, default: false },
}, { timestamps: true });
exports.CartItem = (0, mongoose_1.model)("CartItem", cartItemSchema);
//# sourceMappingURL=CartItem.js.map
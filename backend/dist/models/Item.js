"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
const mongoose_1 = require("mongoose");
const itemSchema = new mongoose_1.Schema({
    owner: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: String,
    category: String,
    size: String,
    genderTarget: String,
    dailyPrice: { type: Number, required: true },
    depositAmount: Number,
    condition: String,
    available: { type: Boolean, default: true },
    images: [String],
}, { timestamps: true });
exports.Item = (0, mongoose_1.model)("Item", itemSchema);
//# sourceMappingURL=Item.js.map
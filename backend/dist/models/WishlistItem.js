"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistItem = void 0;
const mongoose_1 = require("mongoose");
const wishlistItemSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    item: { type: mongoose_1.Schema.Types.ObjectId, ref: "Item", required: true },
}, { timestamps: true });
wishlistItemSchema.index({ user: 1, item: 1 }, { unique: true });
exports.WishlistItem = (0, mongoose_1.model)("WishlistItem", wishlistItemSchema);
//# sourceMappingURL=WishlistItem.js.map
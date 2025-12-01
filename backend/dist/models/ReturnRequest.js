"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReturnRequest = void 0;
const mongoose_1 = require("mongoose");
const returnSchema = new mongoose_1.Schema({
    rental: { type: mongoose_1.Schema.Types.ObjectId, ref: "Rental", required: true },
    renter: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    owner: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
        type: String,
        enum: ["initiated", "in_transit", "received", "issue_reported"],
        default: "initiated"
    },
}, { timestamps: true });
exports.ReturnRequest = (0, mongoose_1.model)("ReturnRequest", returnSchema);
//# sourceMappingURL=ReturnRequest.js.map
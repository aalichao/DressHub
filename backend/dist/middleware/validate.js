"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse({
        body: req.body,
        query: req.query,
        params: req.params,
    });
    if (!result.success) {
        return res.status(400).json({
            errors: result.error.flatten(),
        });
    }
    // put parsed data on req for type-safe access if you want
    req.parsed = result.data;
    next();
};
exports.validate = validate;
//# sourceMappingURL=validate.js.map
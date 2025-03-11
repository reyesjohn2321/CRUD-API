"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            res.status(400).json({
                message: "Validation failed",
                errors: error.details.map((err) => err.message),
            });
            return;
        }
        next();
    };
};
exports.validateRequest = validateRequest;
exports.default = exports.validateRequest; // ✅ Fix: Ensure the file is recognized as a module.

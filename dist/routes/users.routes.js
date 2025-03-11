"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = __importDefault(require("../controllers/users.controller")); // ✅ Default import
const router = (0, express_1.Router)();
// ✅ Mount the users controller directly
router.use("/", users_controller_1.default);
exports.default = router;

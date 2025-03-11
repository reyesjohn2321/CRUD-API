"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_services_1 = require("../services/user.services");
const joi_1 = __importDefault(require("joi"));
const validate_request_1 = __importDefault(require("../middleware/validate-request"));
const router = (0, express_1.Router)();
const userService = new user_services_1.UserService();
// ✅ Validation Schema for Creating a User
const createUserSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required(),
    confirmPassword: joi_1.default.string().valid(joi_1.default.ref("password")).required().messages({
        "any.only": "Passwords must match",
    }),
    title: joi_1.default.string().required(),
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    role: joi_1.default.string().valid("Admin", "User").required(),
});
// ✅ Validation Schema for Updating a User
const updateUserSchema = joi_1.default.object({
    email: joi_1.default.string().email().optional(),
    password: joi_1.default.string().min(6).optional(),
    confirmPassword: joi_1.default.string().valid(joi_1.default.ref("password")).optional().messages({
        "any.only": "Passwords must match",
    }),
    title: joi_1.default.string().optional(),
    firstName: joi_1.default.string().optional(),
    lastName: joi_1.default.string().optional(),
    role: joi_1.default.string().valid("Admin", "User").optional(),
});
// ✅ Wrapper to handle async errors properly
const asyncHandler = (fn) => (req, res, next) => fn(req, res, next).catch(next);
// ✅ Routes
router.get("/", asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userService.getAll();
    res.json(users);
})));
router.get("/:id", asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userService.getById(Number(req.params.id));
    if (!user)
        return res.status(404).json({ message: "User not found" });
    res.json(user);
})));
router.get("/email/:email", asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userService.getByEmail(req.params.email);
    if (!user)
        return res.status(404).json({ message: "User not found" });
    res.json(user);
})));
router.get("/search/:name", asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userService.searchUsers(req.params.name);
    res.json(users);
})));
router.get("/admins", asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const admins = yield userService.getAdmins();
    res.json(admins);
})));
router.post("/", (0, validate_request_1.default)(createUserSchema), asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield userService.create(req.body);
    res.status(201).json(newUser);
})));
router.put("/:id", (0, validate_request_1.default)(updateUserSchema), asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedUser = yield userService.update(Number(req.params.id), req.body);
    if (!updatedUser)
        return res.status(404).json({ message: "User not found" });
    res.json(updatedUser);
})));
router.delete("/:id", asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const success = yield userService.delete(Number(req.params.id));
    if (!success)
        return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
})));
exports.default = router;

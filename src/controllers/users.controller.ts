import { Request, Response, Router, NextFunction } from "express";
import { UserService } from "../services/user.services";
import Joi from "joi";
import validateRequest from "../middleware/validate-request";

const router = Router();
const userService = new UserService();

// ✅ Validation Schema for Creating a User
const createUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
        "any.only": "Passwords must match",
    }),
    title: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    role: Joi.string().valid("Admin", "User").required(),
});

// ✅ Validation Schema for Updating a User
const updateUserSchema = Joi.object({
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).optional().messages({
        "any.only": "Passwords must match",
    }),
    title: Joi.string().optional(),
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    role: Joi.string().valid("Admin", "User").optional(),
});

// ✅ Wrapper to handle async errors properly
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
    (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);

// ✅ Routes
router.get("/", asyncHandler(async (req, res) => {
    const users = await userService.getAll();
    res.json(users);
}));

router.get("/:id", asyncHandler(async (req, res) => {
    const user = await userService.getById(Number(req.params.id));
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
}));

router.get("/email/:email", asyncHandler(async (req, res) => {
    const user = await userService.getByEmail(req.params.email);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
}));

router.get("/search/:name", asyncHandler(async (req, res) => {
    const users = await userService.searchUsers(req.params.name);
    res.json(users);
}));

router.get("/admins", asyncHandler(async (req, res) => {
    const admins = await userService.getAdmins();
    res.json(admins);
}));

router.post("/", validateRequest(createUserSchema), asyncHandler(async (req, res) => {
    const newUser = await userService.create(req.body);
    res.status(201).json(newUser);
}));

router.put("/:id", validateRequest(updateUserSchema), asyncHandler(async (req, res) => {
    const updatedUser = await userService.update(Number(req.params.id), req.body);
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.json(updatedUser);
}));

router.delete("/:id", asyncHandler(async (req, res) => {
    const success = await userService.delete(Number(req.params.id));
    if (!success) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
}));

export default router;

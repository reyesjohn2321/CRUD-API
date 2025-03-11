import { Router } from "express";
import usersController from "../controllers/users.controller"; // ✅ Default import

const router = Router();

// ✅ Mount the users controller directly
router.use("/", usersController);

export default router;

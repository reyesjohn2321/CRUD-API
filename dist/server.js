"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const ormconfig_1 = require("./config/ormconfig");
const users_routes_1 = __importDefault(require("./routes/users.routes")); // ✅ Import routes
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/users", users_routes_1.default); // ✅ Correct route registration
ormconfig_1.AppDataSource.initialize()
    .then(() => {
    console.log("Database connected");
    app.listen(4000, () => console.log("Server listening on port 4000"));
})
    .catch((err) => console.error("Database connection failed:", err));

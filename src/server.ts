import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./config/ormconfig";
import userRoutes from "./routes/users.routes"; // ✅ Import routes

const app = express();
app.use(express.json());

app.use("/users", userRoutes); // ✅ Correct route registration

AppDataSource.initialize()
    .then(() => {
        console.log("Database connected");
        app.listen(4000, () => console.log("Server listening on port 4000"));
    })
    .catch((err) => console.error("Database connection failed:", err));

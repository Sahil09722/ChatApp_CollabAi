// server.js
import express from "express";
import dotenv from "dotenv";
import http from "http";
import morgan from "morgan";
import cors from "cors";

import connectDB from "./config/db.js";
import { initIO } from "./utils/socketManager.js";
import { verifyToken } from "./middleware/auth.js";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import projectRoutes from "./routes/projects.js";
import messageRoutes from "./routes/messages.js";
import taskRoutes from "./routes/tasks.js";
import fileRoutes from "./routes/files.js"; 

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

const server = http.createServer(app);

// Initialize Socket.io and store the instance
initIO(server);

// === API Routes ===
app.get("/", (req, res) => res.send("CollabAI backend is up"));

app.use("/api/auth", authRoutes);
app.use("/api/users", verifyToken, userRoutes);
app.use("/api/projects", verifyToken, projectRoutes);
app.use("/api/projects/:projectId/messages", verifyToken, messageRoutes);
app.use("/api/tasks", verifyToken, taskRoutes);
app.use("/api/projects/:projectId/files", verifyToken, fileRoutes); 

// === Error Handling ===
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Server Error" });
});

server.listen(process.env.PORT || 5000, () => {
  console.log("✅ Server running on port", process.env.PORT || 5000);
});

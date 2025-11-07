import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { createTask, getTasksByProject, updateTask } from "../controllers/taskController.js";

const router = express.Router();

router.post("/", verifyToken, createTask);
router.get("/project/:projectId", verifyToken, getTasksByProject);
router.put("/:id", verifyToken, updateTask);

export default router;

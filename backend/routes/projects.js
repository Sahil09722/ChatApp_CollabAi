import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  createProject,
  getUserProjects,
  getProjectById,
  updateProject,
  joinProject,
  addMemberToProject,
} from "../controllers/projectController.js";

const router = express.Router();

router.post("/", verifyToken, createProject);
router.get("/", verifyToken, getUserProjects);
router.get("/:id", verifyToken, getProjectById);
router.put("/:id", verifyToken, updateProject);
router.post("/:id/join", verifyToken, joinProject);
router.post("/:id/add-members", verifyToken, addMemberToProject);

export default router;

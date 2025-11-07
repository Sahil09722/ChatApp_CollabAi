import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { getMessages, createMessage } from "../controllers/messageController.js";

const router = express.Router({ mergeParams: true });

router.get("/", verifyToken, getMessages);
router.post("/", verifyToken, createMessage);

export default router;

import express from "express";
import { upload } from "../middleware/upload.js";
// controller exports the handler as `handleFileMessage` — import and alias to `uploadFile` for the route
import { handleFileMessage as uploadFile } from "../controllers/fileController.js";

const router = express.Router({ mergeParams: true });

router.post("/", upload.single("file"), uploadFile);

export default router;

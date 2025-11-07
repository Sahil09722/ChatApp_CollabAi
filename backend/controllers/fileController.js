import Message from "../models/Message.js";
import Project from "../models/Project.js";
import { getIO } from "../utils/socketManager.js";

export const handleFileMessage = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.toString();

    if (!req.file || !req.file.path)
      return res.status(400).json({ message: "File upload failed" });
    // Log file metadata for debugging (shows what multer-storage-cloudinary returns)
    console.log("Uploaded file metadata:", req.file);

    // Different storage drivers expose the uploaded file URL under different properties.
    // Try several common ones (path, secure_url, url, location).
    const fileUrl = req.file.path || req.file.secure_url || req.file.url || req.file.location || null;

    if (!fileUrl) {
      console.error("No file URL returned by storage provider for file:", req.file);
      return res.status(500).json({ message: "File uploaded but storage did not return a URL" });
    }
    const originalName = req.file.originalname || "file";

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const isMember =
      project.owner.toString() === userId ||
      project.members.some((id) => id.toString() === userId);
    if (!isMember) return res.status(403).json({ message: "Not authorized" });

    const message = await Message.create({
      project: projectId,
      sender: userId,
      content: originalName,
      fileUrl,
    });

    await message.populate("sender", "name email");

    const io = getIO();
    io.to(projectId).emit("message", message);

    res.status(201).json(message);
  } catch (err) {
    console.error("Cloudinary file upload error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

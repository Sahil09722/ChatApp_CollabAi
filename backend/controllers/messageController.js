import Message from "../models/Message.js";
import Project from "../models/Project.js";
import { getIO } from "../utils/socketManager.js";

// GET /api/projects/:projectId/messages
export const getMessages = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const userId = req.user.toString();
    const isMember =
      project.owner.toString() === userId ||
      project.members.some((id) => id.toString() === userId);

    if (!isMember) return res.status(403).json({ message: "Not authorized" });

    const messages = await Message.find({ project: projectId })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error("GET /messages error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/projects/:projectId/messages
export const createMessage = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { content, fileUrl } = req.body;

    if (!content && !fileUrl)
      return res.status(400).json({ message: "Message content or file is required" });

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const userId = req.user.toString();
    const isMember =
      project.owner.toString() === userId ||
      project.members.some((id) => id.toString() === userId);
    if (!isMember) return res.status(403).json({ message: "Not authorized" });

    const message = await Message.create({
      project: projectId,
      sender: userId,
      content,
      fileUrl,
    });

    await message.populate("sender", "name email");

    const io = getIO();
    io.to(projectId).emit("message", message);

    res.status(201).json(message);
  } catch (err) {
    console.error("POST /messages error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

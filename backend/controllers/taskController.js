import Task from "../models/Task.js";
import Project from "../models/Project.js";

// Helper: check if user is project member or owner
const isProjectMember = (project, userId) => {
  return project.owner.equals(userId) || project.members.includes(userId);
};

// @desc    Create a new task
// @route   POST /api/tasks
export const createTask = async (req, res) => {
  try {
    const { title, description, project, assignee, dueDate, priority } = req.body;

    const proj = await Project.findById(project);
    if (!proj) return res.status(404).json({ message: "Project not found" });

    if (!isProjectMember(proj, req.user._id))
      return res.status(403).json({ message: "Not authorized" });

    const task = await Task.create({
      title,
      description,
      project,
      assignee,
      dueDate,
      priority,
      createdBy: req.user._id,
    });

    res.status(201).json(task);
  } catch (err) {
    console.error("Create Task Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get tasks by project
// @route   GET /api/tasks/project/:projectId
export const getTasksByProject = async (req, res) => {
  try {
    const proj = await Project.findById(req.params.projectId);
    if (!proj) return res.status(404).json({ message: "Project not found" });

    if (!isProjectMember(proj, req.user._id))
      return res.status(403).json({ message: "Not authorized" });

    const tasks = await Task.find({ project: req.params.projectId }).populate(
      "assignee",
      "name email"
    );

    res.json(tasks);
  } catch (err) {
    console.error("Get Tasks Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const proj = await Project.findById(task.project);
    if (!proj) return res.status(404).json({ message: "Project not found" });

    if (!isProjectMember(proj, req.user._id))
      return res.status(403).json({ message: "Not authorized" });

    Object.assign(task, req.body);
    await task.save();

    res.json(task);
  } catch (err) {
    console.error("Update Task Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

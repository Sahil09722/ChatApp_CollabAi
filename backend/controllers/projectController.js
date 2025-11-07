import Project from "../models/Project.js";
import User from "../models/User.js";

// @desc    Create a new project
// @route   POST /api/projects
export const createProject = async (req, res) => {
  try {
    const { title, description, members = [] } = req.body;
    if (!title) return res.status(400).json({ message: "Project title is required" });

    const allMembers = new Set(members.map(id => id.toString()));
    allMembers.add(req.user.toString());

    const project = new Project({
      title,
      description,
      owner: req.user,
      members: Array.from(allMembers),
    });

    await project.save();
    res.status(201).json(project);
  } catch (err) {
    console.error("Create Project Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all projects of current user
// @route   GET /api/projects
export const getUserProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user }, { members: req.user }],
    })
      .populate("owner", "name email")
      .populate("members", "name email");

    res.json(projects);
  } catch (err) {
    console.error("Get User Projects Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name email")
      .populate("members", "name email");

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json(project);
  } catch (err) {
    console.error("Get Project By ID Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update project (owner or member)
// @route   PUT /api/projects/:id
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (!project.owner.equals(req.user) && !project.members.includes(req.user))
      return res.status(403).json({ message: "Not authorized" });

    Object.assign(project, req.body);
    await project.save();

    res.json(project);
  } catch (err) {
    console.error("Update Project Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Join project (adds current user to members)
// @route   POST /api/projects/:id/join
export const joinProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (!project.members.includes(req.user)) {
      project.members.push(req.user);
      await project.save();
    }

    res.json(project);
  } catch (err) {
    console.error("Join Project Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Add a member to a project (owner only)
// @route   POST /api/projects/:id/add-members
export const addMemberToProject = async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.owner.toString() !== req.user.toString())
      return res.status(403).json({ message: "Only the owner can add members" });

    const userExists = await User.findById(userId);
    if (!userExists) return res.status(404).json({ message: "User not found" });

    if (!project.members.map(id => id.toString()).includes(userId)) {
      project.members.push(userId);
      await project.save();
    } else {
      return res.status(400).json({ message: "User already a member" });
    }

    res.status(201).json({ message: "Member added", project });
  } catch (err) {
    console.error("Add Member Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

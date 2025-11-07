import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Helper function to generate JWT
const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

// @desc    Register new user
// @route   POST /api/auth/A
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, skills } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "name, email and password required" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashed, skills });

    res.status(201).json({
      user: { _id: user._id, name: user.name, email: user.email, skills: user.skills },
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("Auth register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      user: { _id: user._id, name: user.name, email: user.email, skills: user.skills },
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("Auth login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

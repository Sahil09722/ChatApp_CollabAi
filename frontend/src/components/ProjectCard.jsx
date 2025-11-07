// src/components/ProjectCard.jsx
import { Link } from "react-router-dom";

export default function ProjectCard({ project, isOwner }) {
  return (
    <Link
      to={`/project/${project._id}`}
      className="bg-white p-4 rounded shadow hover:shadow-md transition"
    >
      <h2 className="text-xl font-semibold">{project.title}</h2>
      <p className="text-gray-600">{project.description}</p>
      <p className="text-xs text-gray-400">
        Owner: {isOwner ? "You" : project.owner?.name || "Unknown"}
      </p>
      <p className="text-xs text-gray-400">
        Members: {project.members?.length || 0}
      </p>
    </Link>
  );
}

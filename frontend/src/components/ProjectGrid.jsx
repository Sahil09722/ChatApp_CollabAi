// src/components/ProjectGrid.jsx
import ProjectCard from "./ProjectCard";

export default function ProjectGrid({ title, projects, isOwner }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <div className="grid grid-cols-3 gap-4">
        {projects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          projects.map((p) => (
            <ProjectCard key={p._id} project={p} isOwner={isOwner} />
          ))
        )}
      </div>
    </div>
  );
}

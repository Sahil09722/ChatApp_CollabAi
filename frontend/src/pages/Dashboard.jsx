// src/pages/Dashboard.jsx
import { useEffect, useState, useContext } from "react";
import API from "../api/api.js";
import { AuthContext } from"../context/AuthContext.js";
import Navbar from "../components/Navbar.jsx";
import ProjectGrid from "../components/ProjectGrid.jsx";
import CreateProjectModal from "../components/CreateProjectModal.jsx";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });
  const { logout } = useContext(AuthContext);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data } = await API.get("/projects");
    setProjects(data);
  };

  const createProject = async (e) => {
    e.preventDefault();
    await API.post("/projects", form);
    setForm({ title: "", description: "" });
    setShowModal(false);
    fetchProjects();
  };

  const ownedProjects = projects.filter(
    (p) => p.owner && String(p.owner._id) === String(userId)
  );
  const memberProjects = projects.filter(
    (p) =>
      p.members &&
      Array.isArray(p.members) &&
      p.members.some((m) => String(m._id || m) === String(userId)) &&
      (!p.owner || String(p.owner._id) !== String(userId))
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar onCreateProject={() => setShowModal(true)} onLogout={logout} />

      <div className="flex-1 overflow-y-auto p-6">
        <ProjectGrid title="Projects You Own" projects={ownedProjects} isOwner />
        <ProjectGrid
          title="Projects You're Involved In"
          projects={memberProjects}
        />
      </div>

      {showModal && (
        <CreateProjectModal
          form={form}
          setForm={setForm}
          onSubmit={createProject}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

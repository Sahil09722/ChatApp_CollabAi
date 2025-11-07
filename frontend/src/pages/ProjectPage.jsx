import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { socket } from "../services/socket.js";
import API from "../api/api.js";
import ChatHeader from "../components/ChatHeader.jsx";
import ChatMessages from "../components/ChatMessages.jsx";
import ChatInput from "../components/ChatInput.jsx";
import AddMemberModal from "../components/AddMemberModal.jsx";

export default function ProjectPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberId, setMemberId] = useState("");

  const currentUserId = localStorage.getItem("userId");

  // Load project + messages
  useEffect(() => {
    if (!id) return;
    socket.emit("joinProject", id);

    const fetchData = async () => {
      setLoading(true);
      try {
        const [projRes, msgRes] = await Promise.all([
          API.get(`/projects/${id}`),
          API.get(`/projects/${id}/messages`),
        ]);
        setProject(projRes.data);
        setMessages(msgRes.data);
      } catch (err) {
        console.error("Error fetching project/messages:", err);
        alert("Failed to load project or messages.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const handleMessage = (msg) => {
      setMessages((prev) =>
        prev.some((m) => m._id === msg._id) ? prev : [...prev, msg]
      );
    };

    socket.on("message", handleMessage);

    return () => {
      socket.emit("leaveProject", id);
      socket.off("message", handleMessage);
    };
  }, [id]);

 

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!memberId.trim()) return alert("Enter a valid User ID.");

    try {
      await API.post(`/projects/${id}/add-members`, {
        userId: memberId.trim(),
      });
      alert(`Member added successfully: ${memberId}`);
      setMemberId("");
      setShowAddMember(false);
      const projRes = await API.get(`/projects/${id}`);
      setProject(projRes.data);
    } catch (err) {
      console.error("Error adding member:", err);
      alert(err.response?.data?.message || "Failed to add member.");
    }
  };

  return (
    <div className="p-6 flex flex-col h-screen">
      <ChatHeader
        project={project}
        currentUserId={currentUserId}
        onAddMemberClick={() => setShowAddMember(true)}
      />
      <ChatMessages
        messages={messages}
        loading={loading}
        currentUserId={currentUserId}
      />
      <ChatInput text={text} setText={setText} projectId={id} />
      <AddMemberModal
        show={showAddMember}
        memberId={memberId}
        setMemberId={setMemberId}
        onClose={() => setShowAddMember(false)}
        onSubmit={handleAddMember}
      />
    </div>
  );
}

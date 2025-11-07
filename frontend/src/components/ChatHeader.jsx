// components/project/ChatHeader.jsx
export default function ChatHeader({ project, currentUserId, onAddMemberClick }) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-semibold">Project Chat</h2>
      {project?.owner?._id === currentUserId && (
        <button
          onClick={onAddMemberClick}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Member
        </button>
      )}
    </div>
  );
}

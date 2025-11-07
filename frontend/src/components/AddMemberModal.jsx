// components/project/AddMemberModal.jsx
export default function AddMemberModal({
  show,
  memberId,
  setMemberId,
  onClose,
  onSubmit,
}) {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={onSubmit}
        className="bg-white p-6 rounded shadow w-96"
      >
        <h2 className="text-xl font-bold mb-4">Add Member to Project</h2>
        <input
          type="text"
          placeholder="Enter member User ID"
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
          className="border p-2 w-full mb-3"
          required
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
}

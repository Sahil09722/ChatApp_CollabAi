import { useState } from "react";
import FileUploadButton from "./FileUploadButton";
import API from "../api/api.js";
import { socket } from "../services/socket.js";

export default function ChatInput({ text, setText, onSend, projectId }) {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() && !file) return;

    try {
      let data;

      // If a file is attached, upload via the files endpoint (multer + Cloudinary)
      if (file) {
        const formData = new FormData();
        if (text.trim()) formData.append("content", text.trim());
        formData.append("file", file);

        // Upload with progress
        setUploading(true);
        setUploadProgress(0);

        const res = await API.post(`/projects/${projectId}/files`, formData, {
          onUploadProgress: (progressEvent) => {
            if (!progressEvent.total) return;
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        });
        data = res.data;
        console.log("File upload response:", data);
        setUploading(false);
        setUploadProgress(0);
      } else {
        // Text-only message
        const res = await API.post(`/projects/${projectId}/messages`, {
          content: text.trim(),
        });
        data = res.data;
      }

      // Server will emit the created message to all clients (including sender).
      // Do not emit from client or append locally to avoid duplicates — wait for server event.
      setText("");
      setFile(null);
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message.");
    }
  };

  return (
    <form onSubmit={handleSend} className="flex items-center gap-2 mt-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="flex-1 border p-2 rounded-lg resize-none h-12"
      />

      <FileUploadButton onFileSelect={setFile} />

      <div className="flex flex-col items-end">
        <button
          type="submit"
          disabled={uploading}
          className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          {uploading ? `Uploading ${uploadProgress}%` : "Send"}
        </button>
        {uploading && (
          <div className="w-40 bg-gray-200 rounded mt-2">
            <div
              className="bg-blue-600 h-1 rounded"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </div>
    </form>
  );
}

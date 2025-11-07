import { useState } from "react";
import { Paperclip, X } from "lucide-react";

export default function FileUploadButton({ onFileSelect }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    onFileSelect(null);
  };

  return (
    <div className="relative flex items-center">
      {/* File input (hidden) */}
      <input
        type="file"
        id="fileInput"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Upload Button */}
      <label
        htmlFor="fileInput"
        className="cursor-pointer bg-gray-200 text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-300 flex items-center gap-2"
      >
        <Paperclip size={18} />
        <span className="hidden sm:inline">Attach</span>
      </label>

      {/* Show selected file */}
      {selectedFile && (
        <div className="flex items-center gap-2 ml-3 bg-gray-100 px-3 py-1 rounded-lg border border-gray-300">
          <span className="text-sm truncate max-w-[100px] sm:max-w-[150px]">
            {selectedFile.name}
          </span>
          <button
            onClick={handleRemoveFile}
            type="button"
            className="text-red-500 hover:text-red-700"
            title="Remove file"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

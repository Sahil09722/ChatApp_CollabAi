// components/project/ChatMessages.jsx
import { useEffect, useRef } from "react";

export default function ChatMessages({ messages, loading, currentUserId }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (loading)
    return <div className="text-center text-gray-500">Loading messages...</div>;

  if (messages.length === 0)
    return <div className="text-center text-gray-400">No messages yet</div>;

  return (
    <div className="flex-1 overflow-y-auto border p-4 rounded bg-gray-50 messages-container">
      <div className="flex-1 overflow-y-auto space-y-3">
        {messages.map((m, idx) => {
          const isSent = m.sender?._id === currentUserId;
          return (
            <div
              key={m._id || `${m.createdAt || idx}-${idx}`}
              className={`flex ${isSent ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs md:max-w-sm lg:max-w-md px-4 py-2 rounded-2xl shadow-md ${
                  isSent
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-900 rounded-bl-none"
                }`}
              >
                {!isSent ? (
                  <p className="text-sm font-semibold text-indigo-700 mb-1">
                    {m.sender?.name || "Unknown User"}
                  </p>
                ) : (
                  <p className="text-sm font-semibold text-gray-100 mb-1 text-right">
                    You
                  </p>
                )}
                <p className="text-sm leading-snug whitespace-pre-wrap">
                  {m.content}
                </p>

                {/* File attachment preview/link */}
                {m.fileUrl && (
                  <div className="mt-2">
                    {/* If the file is an image, show a small preview */}
                    {/(png|jpe?g|gif|webp|bmp|svg)$/i.test(m.fileUrl) ? (
                      <a
                        href={m.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-1"
                      >
                        <img
                          src={m.fileUrl}
                          alt={m.content || "attachment"}
                          className="max-w-xs max-h-40 rounded-md border"
                        />
                      </a>
                    ) : (
                      // Non-image files: show a download/open link
                      <div className="flex flex-col">
                        <a
                          href={m.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Open attachment
                        </a>
                        <small className="text-xs text-gray-500 truncate max-w-xs">
                          {m.fileUrl}
                        </small>
                      </div>
                    )}
                  </div>
                )}
                <p
                  className={`text-[10px] mt-1 ${
                    isSent ? "text-gray-200" : "text-gray-500"
                  } text-right`}
                >
                  {new Date(m.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <div ref={bottomRef} />
    </div>
  );
}

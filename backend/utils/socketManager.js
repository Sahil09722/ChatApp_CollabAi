// utils/socketManager.js
let ioInstance = null; // store the Socket.io instance

// Initialize Socket.io server
export const initIO = async (server, corsOrigin = "*") => {
  if (ioInstance) return ioInstance; // already initialized

  const { Server } = await import("socket.io");
  ioInstance = new Server(server, { cors: { origin: corsOrigin } });

  ioInstance.on("connection", (socket) => {
    console.log("✅ New client connected:", socket.id);

    socket.on("joinProject", (projectId) => {
      socket.join(projectId);
      console.log(`📂 User joined project room: ${projectId}`);
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });

  return ioInstance;
};

// Return the initialized Socket.io instance
export const getIO = () => {
  if (!ioInstance) throw new Error("Socket.io not initialized!");
  return ioInstance;
};

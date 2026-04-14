let rooms = {};

export default (io) => {
  io.on('connection', (socket) => {
    console.log('connected to server:', socket.id);

    // Join room
    socket.on("join-room", ({ roomId }) => {
      socket.join(roomId);
      console.log(`User connected and joined room: ${roomId}`);
      socket.to(roomId).emit("user-joined");
    });

    // WebRTC Signaling Relay
    socket.on("offer", (data) => {
      console.log("Offer relayed for room:", data.roomId);
      socket.to(data.roomId).emit("offer", data.offer);
    });

    socket.on("answer", (data) => {
      console.log("Answer relayed for room:", data.roomId);
      socket.to(data.roomId).emit("answer", data.answer);
    });

    socket.on("ice-candidate", (data) => {
      console.log("ICE candidate exchanged for room:", data.roomId);
      socket.to(data.roomId).emit("ice-candidate", data.candidate);
    });

    // Chat system
    socket.on("chat-message", (data) => {
      socket.to(data.roomId).emit("chat-message", data.message);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      // Room cleanup could be added here
    });
  });
};

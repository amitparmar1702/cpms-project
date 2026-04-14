const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send('🚀 Recruitment Interview Backend is running...');
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["https://cpms-amit.web.app", "http://localhost:5173"],
    methods: ["GET", "POST"]
  },
  transports: ["websocket", "polling"]
});

// ════════════════════════════════════════
// EXAM MONITORING DATA STORE
// ════════════════════════════════════════
let exams = {};

io.on("connection", (socket) => {
  console.log("✅ Connected:", socket.id);

  // ── Existing Interview Logic ──
  socket.on("join-room", ({ roomId }) => {
    socket.join(roomId);
    const roomSize = io.sockets.adapter.rooms.get(roomId)?.size || 0;
    console.log(`📥 [${roomId}] Joined. Peer count: ${roomSize}`);
    socket.to(roomId).emit("user-joined");
  });

  socket.on("offer", (data) => {
    console.log(`📤 [${data.roomId}] Offer Relay Attempt`);
    socket.to(data.roomId).emit("offer", data.offer);
  });

  socket.on("answer", (data) => {
    console.log(`📥 [${data.roomId}] Answer Relay Attempt`);
    socket.to(data.roomId).emit("answer", data.answer);
  });

  socket.on("ice-candidate", (data) => {
    socket.to(data.roomId).emit("ice-candidate", data.candidate);
  });

  socket.on("chat-message", (data) => {
    socket.to(data.roomId).emit("chat-message", data.message);
  });

  // ── START EXAM MONITORING LOGIC ──

  socket.on("exam-join", ({ examId, studentId, studentName }) => {
    socket.join(`exam-${examId}`);
    
    if (!exams[examId]) {
      exams[examId] = { students: {} };
    }

    exams[examId].students[studentId] = {
      socketId: socket.id,
      name: studentName,
      joinedAt: new Date().toISOString(),
      lastSnapshot: null,
      activityLog: [],
      status: 'active'
    };

    console.log(`👨‍🎓 Student ${studentName} joined Exam ${examId}`);
    
    // Notify admin monitoring room
    io.to(`admin-${examId}`).emit("student-joined", { studentId, student: exams[examId].students[studentId] });
  });

  socket.on("exam-snapshot", ({ examId, studentId, snapshot, timestamp }) => {
    if (exams[examId] && exams[examId].students[studentId]) {
      exams[examId].students[studentId].lastSnapshot = { snapshot, timestamp };
      exams[examId].students[studentId].status = 'active';
      
      // Relay to admin room
      io.to(`admin-${examId}`).emit("student-snapshot-update", { studentId, snapshot, timestamp });
    }
  });

  socket.on("exam-suspicious-activity", ({ examId, studentId, type, timestamp }) => {
    if (exams[examId] && exams[examId].students[studentId]) {
      const alert = { type, timestamp };
      exams[examId].students[studentId].activityLog.push(alert);
      exams[examId].students[studentId].status = 'suspicious';
      
      console.warn(`🚨 Suspicious: ${studentId} - ${type}`);
      
      // Relay alert to admin room
      io.to(`admin-${examId}`).emit("student-activity-alert", { studentId, alert });
    }
  });

  socket.on("exam-end", ({ examId, studentId }) => {
    if (exams[examId] && exams[examId].students[studentId]) {
      exams[examId].students[studentId].status = 'finished';
      io.to(`admin-${examId}`).emit("student-finished", { studentId });
    }
  });

  socket.on("admin-monitor-join", ({ examId }) => {
    socket.join(`admin-${examId}`);
    console.log(`👨‍💼 Admin joined monitoring for Exam ${examId}`);
    
    // Send current state of all students to this admin
    const currentState = exams[examId] ? exams[examId].students : {};
    socket.emit("monitoring-initial-state", currentState);
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected:", socket.id);
    
    // Find if this socket belonged to a student
    for (const examId in exams) {
      for (const studentId in exams[examId].students) {
        if (exams[examId].students[studentId].socketId === socket.id) {
          exams[examId].students[studentId].status = 'offline';
          io.to(`admin-${examId}`).emit("student-offline", { studentId });
          break;
        }
      }
    }
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Server running on port", PORT);
});

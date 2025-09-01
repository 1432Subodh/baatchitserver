import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
  pingInterval: 25000,  // send ping every 25s
  pingTimeout: 60000,   // allow 60s before dropping client
});

io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  socket.on("join", (username) => {
    socket.join(username);
    console.log(`👤 ${username} joined room`);
  });

  socket.on("private-message", (msg) => {
    io.to(msg.to).emit("private-message", msg);
  });

  socket.on("seen-message", ({ msgId, from }) => {
    io.to(from).emit("message-seen", { msgId });
  });

  socket.on("disconnect", (reason) => {
    console.log(`❌ Disconnected (${socket.id}): ${reason}`);
  });
});

server.listen(4000, () => console.log("✅ Socket server running on 4000"));

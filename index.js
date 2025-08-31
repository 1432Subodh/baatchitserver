import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("join", (username) => {
    socket.join(username);
  });

  socket.on("private-message", (msg) => {
    io.to(msg.to).emit("private-message", msg);
  });

  socket.on("seen-message", ({ msgId, from }) => {
    io.to(from).emit("message-seen", { msgId });
  });
});

server.listen(4000, () => console.log("Socket server running on 4000"));

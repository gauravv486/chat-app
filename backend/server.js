import "dotenv/config";

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

//http module
import { createServer } from "http";

//server class of socket.io
import { Server } from "socket.io";

import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/auth.routes.js";
import messageRoutes from "./src/routes/message.routes.js";


await connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

app.use("/api/messages" , messageRoutes);


//Previously: app.listen(PORT) — Express handled HTTP itself
//Now: httpServer handles HTTP, and Socket.IO will attach to it
const httpServer = createServer(app);


//Create a Socket.IO instance and attach it to the HTTP server
//cors config here must match your Express cors — same CLIENT_URL
//credentials: true is needed because you use cookies (JWT)
export const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL, credentials: true
  }
})

// io.on("connection") fires every time a NEW user opens the app
// 'socket' represents THAT specific user's connection
// Each user gets a unique socket.id automatically


// store this OUTSIDE io.on("connection")
// so it persists across all connections
const userSocketMap = {};  // { userId: socketId }

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  // socket.on("disconnect") fires when THIS user closes the tab
  // or loses internet — cleanup logic goes here later

  // frontend will send their userId when they connect
  const userId = socket.handshake.auth.userId;
  console.log("userId:", userId);  // should now show mongo id

  if (userId) {
    userSocketMap[userId] = socket.id;
  }


  // send the list of ALL online user IDs to EVERYONE
  // Object.keys() gives you ["userId1", "userId2", ...]
  io.emit("getOnlineUsers", Object.keys(userSocketMap));


  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  })
})

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
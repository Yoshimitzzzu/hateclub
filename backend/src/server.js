const socketAuth = require("./socketAuth");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const authRoutes = require("./auth");
const pool = require("./db");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
}));

app.use(express.json());
app.use("/auth", authRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.use(socketAuth);

// ================= ONLINE USERS =================
const onlineUsers = new Map();

const emitOnlineUsers = () => {

  io.emit(
    "online_users",
    Array.from(onlineUsers.keys()).map(
      (username) => ({
        username,
        online: true,
      })
    )
  );
};

// ================= SOCKET =================
io.on("connection", (socket) => {

  const username = socket.user.username;

  console.log("connected:", username);

  // online
  onlineUsers.set(username, socket.id);

  emitOnlineUsers();

  // ================= JOIN DM =================
  socket.on("join_dm", ({ to }) => {

    const roomId = [username, to]
      .sort()
      .join("_");

    socket.join(roomId);

    socket.currentRoom = roomId;
  });

  // ================= LOAD HISTORY =================
  socket.on("load_dm", async ({ to }) => {

    const roomId = [username, to]
      .sort()
      .join("_");

    try {

      const result = await pool.query(
        `
        SELECT *
        FROM messages
        WHERE room = $1
        ORDER BY created_at ASC
        `,
        [roomId]
      );

      socket.emit(
        "dm_history",
        result.rows
      );

    } catch (err) {
      console.log(err);
    }
  });

  // ================= SEND MESSAGE =================
  socket.on("send_dm", async ({
    to,
    text,
    time,
    date,
  }) => {

    const roomId = [username, to]
      .sort()
      .join("_");

    const msg = {
      username,
      to,
      text,
      time,
      date,
      room: roomId,
    };

    try {

      await pool.query(
        `
        INSERT INTO messages
        (username, text, time, date, room)
        VALUES ($1, $2, $3, $4, $5)
        `,
        [
          username,
          text,
          time,
          date,
          roomId,
        ]
      );

      io.to(roomId).emit(
        "receive_dm",
        msg
      );

    } catch (err) {
      console.log(err);
    }
  });

  // ================= TYPING =================
  socket.on("typing", ({ to }) => {

    const roomId = [username, to]
      .sort()
      .join("_");

    socket.to(roomId).emit(
      "user_typing",
      username
    );
  });

  socket.on("stop_typing", ({ to }) => {

    const roomId = [username, to]
      .sort()
      .join("_");

    socket.to(roomId).emit(
      "user_stop_typing",
      username
    );
  });

  // ================= DISCONNECT =================
  socket.on("disconnect", () => {

    console.log("disconnect:", username);

    onlineUsers.delete(username);

    emitOnlineUsers();
  });
});

server.listen(3000, () => {
  console.log("Server started on 3000");
});
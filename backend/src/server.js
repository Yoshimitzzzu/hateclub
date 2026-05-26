const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const authRoutes = require("./auth");

const pool = require("./db");

const app = express();


// ✅ ВАЖНО: CORS ДО РОУТОВ
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


io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", async ({ room, username }) => {
    socket.join(room);

    socket.room = room;
    socket.username = username;

    console.log(`${username} joined ${room}`);

    try {
      const result = await pool.query(
        `
        SELECT * FROM messages
        WHERE room = $1
        ORDER BY created_at ASC
        `,
        [room]
      );

      socket.emit("load_messages", result.rows);

    } catch (error) {
      console.log(error);
    }
  });

  socket.on("send_message", async (data) => {
    const { room, username, text } = data;

    try {
      await pool.query(
        `
        INSERT INTO messages (room, username, text)
        VALUES ($1, $2, $3)
        `,
        [room, username, text]
      );

      io.to(room).emit("receive_message", data);

    } catch (error) {
      console.log(error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


server.listen(3000, () => {
  console.log("Server started on port 3000");
});
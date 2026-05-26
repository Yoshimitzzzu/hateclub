import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useEffect, useRef, useState } from "react";

import { socket } from "./socket/socket";

import "./styles/global.css";

import JoinPage from "./pages/JoinPage";
import ChatPage from "./pages/ChatPage";
import Auth from "./pages/Auth";

function App() {
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );

  const [room, setRoom] = useState(
    localStorage.getItem("room") || ""
  );

  const [joined, setJoined] = useState(
    localStorage.getItem("joined") === "true"
  );

  const [token, setToken] = useState(
    localStorage.getItem("token") || ""
  );

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const messagesEndRef = useRef(null);

  const rooms = [
    "general",
    "friends",
    "games",
    "music",
    "coding",
  ];

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("load_messages", (data) => {
      setMessages(data);
    });

    return () => {
      socket.off("receive_message");
      socket.off("load_messages");
    };
  }, []);

  useEffect(() => {
    if (joined && username && room) {
      socket.emit("join_room", {
        room,
        username,
      });
    }
  }, [joined, username, room]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const joinChat = () => {
    if (!username.trim()) return;
    if (!room.trim()) return;

    socket.emit("join_room", {
      room,
      username,
    });

    localStorage.setItem("username", username);
    localStorage.setItem("room", room);
    localStorage.setItem("joined", "true");

    setJoined(true);
  };

  const changeRoom = (newRoom) => {
    setMessages([]);

    socket.emit("join_room", {
      room: newRoom,
      username,
    });

    setRoom(newRoom);
  };

  const sendMessage = () => {
    if (!message.trim()) return;

    const data = {
      room,
      username,
      text: message,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("send_message", data);

    setMessage("");
  };

  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN ROUTE */}
        <Route
          path="/login"
          element={
            token ? (
              <Navigate to="/chat" />
            ) : (
              <Auth setToken={setToken} />
            )
          }
        />

        {/* ROOT */}
        <Route
          path="/"
          element={
            token ? (
              <Navigate to="/chat" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* CHAT */}
        <Route
          path="/chat"
          element={
            token ? (
              joined ? (
                <ChatPage
                  rooms={rooms}
                  room={room}
                  changeRoom={changeRoom}
                  username={username}
                  messages={messages}
                  message={message}
                  setMessage={setMessage}
                  sendMessage={sendMessage}
                  messagesEndRef={messagesEndRef}
                />
              ) : (
                <JoinPage
                  username={username}
                  setUsername={setUsername}
                  room={room}
                  setRoom={setRoom}
                  joinChat={joinChat}
                />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
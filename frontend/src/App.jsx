import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { createSocket } from "./socket/socket";

import "./styles/global.css";

import Auth from "./pages/Auth";
import ChatPage from "./pages/ChatPage";

function App() {

  const [token, setToken] = useState(
    localStorage.getItem("token") || ""
  );

  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );

  const [message, setMessage] = useState("");

  const [dmMessages, setDmMessages] = useState([]);

  const [onlineUsers, setOnlineUsers] = useState([]);

  const [typingUsers, setTypingUsers] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);

  const messagesEndRef = useRef(null);

  const socketRef = useRef(null);

  // ================= SOCKET =================
  useEffect(() => {

    if (!token) return;

    socketRef.current = createSocket();

    // ================= ONLINE USERS =================
    socketRef.current.on(
      "online_users",
      (users) => {

        setOnlineUsers(users);
      }
    );

    // ================= DM HISTORY =================
    socketRef.current.on(
      "dm_history",
      (data) => {

        setDmMessages(data);
      }
    );

    // ================= RECEIVE MESSAGE =================
    socketRef.current.on(
      "receive_dm",
      (msg) => {

        setDmMessages((prev) => [
          ...prev,
          msg,
        ]);
      }
    );

    // ================= TYPING =================
    socketRef.current.on(
      "user_typing",
      (user) => {

        setTypingUsers((prev) => {

          if (prev.includes(user)) {
            return prev;
          }

          return [...prev, user];
        });
      }
    );

    socketRef.current.on(
      "user_stop_typing",
      (user) => {

        setTypingUsers((prev) =>
          prev.filter(
            (u) => u !== user
          )
        );
      }
    );

    return () => {

      socketRef.current?.off(
        "online_users"
      );

      socketRef.current?.off(
        "dm_history"
      );

      socketRef.current?.off(
        "receive_dm"
      );

      socketRef.current?.off(
        "user_typing"
      );

      socketRef.current?.off(
        "user_stop_typing"
      );

      socketRef.current?.disconnect();
    };

  }, [token]);

  // ================= OPEN DM =================
  useEffect(() => {

    if (!selectedUser) return;

    socketRef.current.emit(
      "join_dm",
      {
        to: selectedUser,
      }
    );

    socketRef.current.emit(
      "load_dm",
      {
        to: selectedUser,
      }
    );

    setTypingUsers([]);

  }, [selectedUser]);

  // ================= AUTO SCROLL =================
  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [dmMessages]);

  // ================= SEND MESSAGE =================
  const sendMessage = () => {

    if (
      !message.trim() ||
      !selectedUser
    ) return;

    const now = new Date();

    socketRef.current.emit(
      "send_dm",
      {
        to: selectedUser,

        text: message,

        time: now.toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }
        ),

        date: now.toLocaleDateString(
          "ru-RU"
        ),
      }
    );

    socketRef.current.emit(
      "stop_typing",
      {
        to: selectedUser,
      }
    );

    setMessage("");
  };

  // ================= LOGOUT =================
  const logout = () => {

    socketRef.current?.disconnect();

    localStorage.clear();

    setDmMessages([]);

    window.location.reload();
  };

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={
            token ? (
              <Navigate to="/chat" />
            ) : (
              <Auth
                setToken={setToken}
                setUsername={setUsername}
              />
            )
          }
        />

        <Route
          path="/chat"
          element={
            token ? (
              <ChatPage
                username={username}

                message={message}
                setMessage={setMessage}

                sendMessage={sendMessage}

                messages={dmMessages}

                messagesEndRef={messagesEndRef}

                onlineUsers={onlineUsers}

                typingUsers={typingUsers}

                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}

                socketRef={socketRef}

                logout={logout}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
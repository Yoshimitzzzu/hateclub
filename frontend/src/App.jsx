import { useEffect, useState } from "react";
import { socket } from "./socket";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    socket.on("receive_message", (data) => {
      console.log("Received:", data);
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("connect");
      socket.off("receive_message");
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("send_message", {
      text: message,
      time: new Date().toLocaleTimeString(),
    });

    setMessage("");
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Mini Messenger</h1>

      <div style={{ marginBottom: 10 }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message..."
          style={{ padding: 8, width: 200 }}
        />

        <button onClick={sendMessage} style={{ marginLeft: 10, padding: 8 }}>
          Send
        </button>
      </div>

      <div>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: 5 }}>
            <b>{msg.time}</b>: {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
import Message from "./Message";

function Chat({
  room,
  messages,
  username,
  message,
  setMessage,
  sendMessage,
  messagesEndRef,
}) {
  return (
    <main className="chat">
      <div className="chat-header">
        <div>
          <h2>#{room}</h2>
          <span>Realtime chat</span>
        </div>
      </div>

      <div className="messages">
        {messages.map((msg, i) => (
          <Message
            key={i}
            msg={msg}
            username={username}
          />
        ))}

        <div ref={messagesEndRef}></div>
      </div>

      <div className="chat-input">
        <input
          placeholder="Type message..."
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />

        <button onClick={sendMessage}>
          Send
        </button>
      </div>
    </main>
  );
}

export default Chat;
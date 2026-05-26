import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";

function ChatPage({
  rooms,
  room,
  changeRoom,
  username,
  messages,
  message,
  setMessage,
  sendMessage,
  messagesEndRef,
}) {
  return (
    <div className="app">
      <Sidebar
        rooms={rooms}
        room={room}
        changeRoom={changeRoom}
        username={username}
      />

      <Chat
        room={room}
        messages={messages}
        username={username}
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
        messagesEndRef={messagesEndRef}
      />
    </div>
  );
}

export default ChatPage;
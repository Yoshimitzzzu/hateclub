function ChatPage({
  username,

  message,
  setMessage,

  sendMessage,

  messages,

  messagesEndRef,

  onlineUsers,

  typingUsers,

  selectedUser,
  setSelectedUser,

  socketRef,

  logout,
}) {

  return (

    <div className="chat-layout">

      {/* HEADER */}
      <div className="chat-header">

        <div className="chat-user">

          <span className="chat-user-name">
            @{username}
          </span>

          <span className="chat-user-status">
            online
          </span>

        </div>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>

      </div>

      {/* MAIN */}
      <div className="chat-main">

        {/* USERS SIDEBAR */}
        <div className="users-panel">

          <div className="users-title">
            Users
          </div>

          {onlineUsers
            .filter(
              (u) =>
                u.username !== username
            )
            .map((user, i) => (

              <div
                key={i}
                className={
                  selectedUser === user.username
                    ? "user-item active-user"
                    : "user-item"
                }
                onClick={() =>
                  setSelectedUser(
                    user.username
                  )
                }
              >

                <div className="user-item-top">

                  <span>
                    @{user.username}
                  </span>

                  <span className="online-dot"></span>

                </div>

              </div>
            ))}

        </div>

        {/* CHAT AREA */}
        <div className="chat-area">

          {/* CHAT INFO */}
          <div className="chat-info">

            {selectedUser ? (
              <>

                <div className="chat-info-user">
                  @{selectedUser}
                </div>

                <div className="chat-info-status">
                  {
                    onlineUsers.find(
                      (u) =>
                        u.username ===
                        selectedUser
                    )
                      ? "online"
                      : "offline"
                  }
                </div>

              </>
            ) : (
              <div className="chat-info-user">
                Select user
              </div>
            )}

          </div>

          {/* MESSAGES */}
          <div className="messages">

            {messages.map((msg, i) => {

              const prev =
                messages[i - 1];

              const showDate =
                !prev ||
                prev.date !== msg.date;

              const isOwn =
                msg.username === username;

              return (
                <div key={i}>

                  {showDate && (
                    <div className="date-divider">
                      {msg.date}
                    </div>
                  )}

                  <div
                    className={
                      isOwn
                        ? "message-row own-row"
                        : "message-row"
                    }
                  >

                    <div
                      className={
                        isOwn
                          ? "message own-message"
                          : "message"
                      }
                    >

                      <div className="message-top">

                        <span className="message-user">
                          @{msg.username}
                        </span>

                        <span className="message-time">
                          {msg.time}
                        </span>

                      </div>

                      <div className="message-text">
                        {msg.text}
                      </div>

                    </div>

                  </div>

                </div>
              );
            })}

            <div ref={messagesEndRef}></div>

          </div>

          {/* INPUT */}
          <div className="chat-input-wrapper">

            {/* TYPING */}
            {typingUsers.length > 0 && (
              <div className="typing-row">

                <span className="typing-name">
                  {typingUsers.join(", ")}
                </span>

                <span className="typing-dots">

                  <span className="dot"></span>

                  <span className="dot"></span>

                  <span className="dot"></span>

                </span>

              </div>
            )}

            <div className="chat-input">

              <input
                type="text"

                value={message}

                placeholder={
                  selectedUser
                    ? "Write message..."
                    : "Select user first"
                }

                disabled={!selectedUser}

                onChange={(e) => {

                  setMessage(
                    e.target.value
                  );

                  socketRef.current?.emit(
                    "typing",
                    {
                      to: selectedUser,
                    }
                  );
                }}

                onBlur={() => {

                  socketRef.current?.emit(
                    "stop_typing",
                    {
                      to: selectedUser,
                    }
                  );
                }}

                onKeyDown={(e) => {

                  if (
                    e.key === "Enter"
                  ) {

                    socketRef.current?.emit(
                      "stop_typing",
                      {
                        to: selectedUser,
                      }
                    );

                    sendMessage();
                  }
                }}
              />

              <button
                onClick={sendMessage}

                disabled={!selectedUser}
              >
                Send
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ChatPage;
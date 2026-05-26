function Message({ msg, username }) {
  return (
    <div
      className={
        msg.username === username
          ? "message own"
          : "message"
      }
    >
      <div className="message-user">
        {msg.username}
      </div>

      <div className="message-text">
        {msg.text}
      </div>

      <div className="message-time">
        {msg.time || ""}
      </div>
    </div>
  );
}

export default Message;
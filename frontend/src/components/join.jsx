function Join({
  username,
  setUsername,
  room,
  setRoom,
  joinChat,
}) {
  return (
    <div className="join-page">
      <div className="join-box">
        <h1>Mini Messenger</h1>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <input
          placeholder="Room"
          value={room}
          onChange={(e) =>
            setRoom(e.target.value)
          }
        />

        <button onClick={joinChat}>
          Join Chat
        </button>
      </div>
    </div>
  );
}

export default Join;
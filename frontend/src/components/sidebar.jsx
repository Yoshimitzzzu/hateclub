function Sidebar({
  rooms,
  room,
  changeRoom,
  username,
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Rooms</h2>
      </div>

      <div className="room-list">
        {rooms.map((item) => (
          <button
            key={item}
            className={
              room === item
                ? "room active"
                : "room"
            }
            onClick={() => changeRoom(item)}
          >
            # {item}
          </button>
        ))}
      </div>

      <div className="sidebar-user">
        <div className="avatar">
          {username[0]?.toUpperCase()}
        </div>

        <div>
          <div className="username">
            {username}
          </div>

          <div className="status">
            online
          </div>
        </div>
      </div>

      <button
        className="logout-btn"
        onClick={() => {
          localStorage.clear();
          window.location.reload();
        }}
      >
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;
import { useState } from "react";

function Auth({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
  console.log("CLICKED");

  const url = isLogin
    ? "http://localhost:3000/auth/login"
    : "http://localhost:3000/auth/register";

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    console.log("RESPONSE:", data);

    if (isLogin && data.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
    }

    if (!isLogin && data.success) {
      setIsLogin(true);
    }

  } catch (err) {
    console.log("ERROR:", err);
  }
};

  return (
    <div className="auth-container">
      <div className="auth-box">

        <h1 className="logo">Mini Messenger</h1>

        <div className="tabs">
          <button
            className={isLogin ? "active" : ""}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>

          <button
            className={!isLogin ? "active" : ""}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        <input
          placeholder="username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button className="primary" onClick={submit}>
          {isLogin ? "Login" : "Create account"}
        </button>

      </div>
    </div>
  );
}

export default Auth;
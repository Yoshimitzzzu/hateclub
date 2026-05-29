import { useState } from "react";

function Auth({
  setToken,
  setUsername,
}) {
  const [isLogin, setIsLogin] = useState(true);

  const [username, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    setSuccess("");

    const url = isLogin
      ? "http://localhost:3000/auth/login"
      : "http://localhost:3000/auth/register";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      if (isLogin && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", username);

        setToken(data.token);
        setUsername(username);
      }

      if (!isLogin && data.success) {
        setSuccess("Account created successfully");
        setIsLogin(true);
      }

    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-box">

        <div className="auth-tabs">
          <button
            className={isLogin ? "active-tab" : ""}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>

          <button
            className={!isLogin ? "active-tab" : ""}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        <h1>
          {isLogin ? "Welcome back" : "Create account"}
        </h1>

        {success && (
          <div className="success-msg">
            {success}
          </div>
        )}

        {error && (
          <div className="error-msg">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsernameInput(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          className="auth-submit"
          onClick={submit}
        >
          {isLogin ? "Login" : "Register"}
        </button>

      </div>

    </div>
  );
}

export default Auth;
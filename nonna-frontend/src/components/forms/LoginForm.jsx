import { useState } from "react";
import AuthButton from "../buttons/AuthButton";
import "../../styles/form.css";

export default function LoginForm({ setToken, switchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError("");

    const payload = { email, password };

    // Send login request to backend
    const response = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    let data;
    try {
      // parse JSON response
      data = await response.json();
    } catch {
      // If backend returns plain text instead of JSON, show it
      const text = await response.text();
      setLoginError(text || "Login failed. Please try again.");
      return;
    }

    // Successful login: store JWT token
    if (response.ok && data.token) {
      setToken(data.token);
    } else {
      // Backend error message
      setLoginError(data.error || "Invalid login.");
    }
  }

  // Disable login if fields are empty
  const isIncomplete =
    email.trim().length === 0 || password.trim().length === 0;

  return (
    <div className="card auth-card">
      <form className="form-container" onSubmit={handleLogin}>
        <h2>Login</h2>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          required
          onChange={e => setEmail(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          required
          onChange={e => setPassword(e.target.value)}
        />

        {/* failed login message */}
        {loginError && (
          <p className="inputError" role="alert">
            {loginError}
          </p>
        )}

        <AuthButton
          type="submit"
          disabled={isIncomplete}
          ariaDisabled={isIncomplete}
        >
          Login
        </AuthButton>

        <p onClick={switchToRegister} className="switch-link">
          Create an account
        </p>
      </form>
    </div>
  );
}

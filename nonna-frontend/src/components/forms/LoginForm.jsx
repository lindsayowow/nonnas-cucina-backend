import { useState } from "react";
import AuthButton from "../buttons/AuthButton";
import "../../styles/form.css";

export default function LoginForm({ setToken, switchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    const payload = { email, password };

    const response = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    let data;
    try {
      data = await response.json();
    } catch {
      const text = await response.text();
      alert(text);
      return;
    }

    if (response.ok && data.token) {
      setToken(data.token);
    } else {
      alert(data.error || "Invalid login.");
    }
  }

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

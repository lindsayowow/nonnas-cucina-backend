import React, { useState, useEffect } from "react";
import Profile from "../components/Profile";
import LoginForm from "../components/forms/LoginForm";
import RegisterForm from "../components/forms/RegisterForm";
import "../styles/auth.css";   // ⭐ make sure this file exists

export default function Auth({ setToken }) {
  const [authMode, setAuthMode] = useState("login");
  const [localToken, setLocalToken] = useState(localStorage.getItem("token"));

  function decodeToken(token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload;
    } catch (err) {
      console.error("Invalid token", err);
      return null;
    }
  }

  useEffect(() => {
    if (!localToken) {
      setToken(null);
      return;
    }

    const decoded = decodeToken(localToken);

    if (!decoded || !decoded.exp) {
      localStorage.removeItem("token");
      setLocalToken(null);
      setToken(null);
      return;
    }

    const isExpired = decoded.exp * 1000 < Date.now();
    if (isExpired) {
      console.log("Token expired — logging out");
      localStorage.removeItem("token");
      setLocalToken(null);
      setToken(null);
    }
  }, [localToken, setToken]);

  useEffect(() => {
    if (localToken) {
      localStorage.setItem("token", localToken);
      setToken(localToken);
    }
  }, [localToken, setToken]);

  // Logged in → show profile inside centered container
  if (localToken) {
    return (
      <section
        className="auth-container"
        role="region"
        aria-labelledby="auth-title"
      >
        <h1 id="auth-title" className="visually-hidden">
          My Account
        </h1>

        <Profile token={localToken} setToken={setLocalToken} />
      </section>
    );
  }

  // Not logged in → show login/register in same centered container
  return (
    <section
      className="auth-container"
      role="region"
      aria-labelledby="auth-title"
    >
      <h1 id="auth-title" className="visually-hidden">
        Authentication
      </h1>

      {authMode === "login" && (
        <LoginForm
          setToken={(token) => setLocalToken(token)}
          switchToRegister={() => setAuthMode("register")}
        />
      )}

      {authMode === "register" && (
        <RegisterForm switchToLogin={() => setAuthMode("login")} />
      )}
    </section>
  );
}

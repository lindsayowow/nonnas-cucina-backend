import React, { useState, useEffect } from "react";
import Profile from "../components/Profile";
import LoginForm from "../components/forms/LoginForm";
import RegisterForm from "../components/forms/RegisterForm";

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

  // Validate token on load + whenever localToken changes
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

  // Sync localToken → App.jsx token + localStorage
  useEffect(() => {
    if (localToken) {
      localStorage.setItem("token", localToken);
      setToken(localToken);
    }
  }, [localToken, setToken]);

  // Logged in → show profile
  if (localToken) {
    return <Profile token={localToken} setToken={setLocalToken} />;
  }

  // Not logged in → show login/register
  return (
    <section className="auth-container">
      {authMode === "login" && (
        <LoginForm
          setToken={setLocalToken}
          switchToRegister={() => setAuthMode("register")}
        />
      )}

      {authMode === "register" && (
        <RegisterForm
          switchToLogin={() => setAuthMode("login")}
        />
      )}
    </section>
  );
}

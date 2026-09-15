import React, { useState, useEffect } from "react";
import Profile from "../components/Profile";
import LoginForm from "../components/forms/LoginForm";
import RegisterForm from "../components/forms/RegisterForm";

export default function Auth({ setToken }) {
  const [authMode, setAuthMode] = useState("login");
  const [localToken, setLocalToken] = useState(localStorage.getItem("token"));

  // Decode token safely
  function decodeToken(token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload;
    } catch (err) {
      console.error("Invalid token", err);
      return null;
    }
  }

  // Check expiration on first load
  useEffect(() => {
    if (!localToken) return;

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
  }, []);

  // When token changes, update localStorage + send to App.jsx
  useEffect(() => {
    if (localToken) {
      localStorage.setItem("token", localToken);
      setToken(localToken);   // send token to App.jsx
    }
  }, [localToken]);

  // If logged in, show profile
  if (localToken) {
    return <Profile token={localToken} setToken={setLocalToken} />;
  }

  // If not logged in, show login or register
  return (
    <section className="auth-container">
      {authMode === "login" && (
        <LoginForm
          setToken={setLocalToken}   // ⭐ LoginForm sets localToken → bubbles to App.jsx
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

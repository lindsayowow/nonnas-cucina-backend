import React, { useState, useEffect } from "react";
import Profile from "../components/Profile";
import LoginForm from "../components/forms/LoginForm";
import RegisterForm from "../components/forms/RegisterForm";
import SideBarNav from "../components/template/SideBarNav";
import "../styles/auth.css";

export default function Auth({ setToken }) {
  const [authMode, setAuthMode] = useState("login");
  const [localToken, setLocalToken] = useState(localStorage.getItem("token"));
  const [editing, setEditing] = useState(false);

  function decodeToken(token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload;
    } catch {
      // Malformed/invalid token -- treat as logged out
      return null;
    }
  }

  useEffect(() => {
    if (!localToken) {
      setToken(null);
      window.dispatchEvent(new Event("authchange"));
      return;
    }

    const decoded = decodeToken(localToken);

    if (!decoded || !decoded.exp) {
      localStorage.removeItem("token");
      setLocalToken(null);
      setToken(null);
      window.dispatchEvent(new Event("authchange"));
      return;
    }

    const isExpired = decoded.exp * 1000 < Date.now();
    if (isExpired) {
      // Token expired -- clear it and log the user out
      localStorage.removeItem("token");
      setLocalToken(null);
      setToken(null);
      window.dispatchEvent(new Event("authchange"));
    }
  }, [localToken, setToken]);

  useEffect(() => {
    if (localToken) {
      localStorage.setItem("token", localToken);
      setToken(localToken);
      window.dispatchEvent(new Event("authchange"));
    }
  }, [localToken, setToken]);

  /* Logged in → show sidebar + profile in 2-column layout */
  if (localToken) {
    return (
      <section
        className="auth-layout"
        role="region"
        aria-labelledby="auth-title"
      >
        <h1 id="auth-title" className="visually-hidden">
          My Account
        </h1>

        <SideBarNav
          setToken={setLocalToken}
          onEditProfile={() => setEditing(true)}
        />

        <Profile
          token={localToken}
          editing={editing}
          setEditing={setEditing}
        />
      </section>
    );
  }

  /* Not logged in → show login/register centered */
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

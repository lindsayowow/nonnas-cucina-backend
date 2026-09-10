import React from "react";
import { useState, useEffect } from "react";
import Profile from "../components/Profile";
import LoginForm from "../components/forms/LoginForm";
import RegisterForm from "../components/forms/RegisterForm";        
// import "../styles/auth.css";

export default function Auth() {
  const [authMode, setAuthMode] = useState("login"); 
  const [token, setToken] = useState(localStorage.getItem("token"));

  // When token changes, update localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    }
  }, [token]);

  // If logged in, always show profile
  if (token) {
    return <Profile token={token} setToken={setToken} />;
  }

  // If not logged in, show login or register
  return (
    <section className="auth-container">
      {authMode === "login" && (
        <LoginForm 
          setToken={setToken}
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

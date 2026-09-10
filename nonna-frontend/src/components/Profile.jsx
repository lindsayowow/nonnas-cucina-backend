import React from "react";

export default function Profile({ token, setToken }) {

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
  }

  return (
    <div className="profile-view">
      <h2>My Profile</h2>

      <p>You are logged in.</p>

      <button onClick={logout}>Logout</button>
    </div>
  );
}

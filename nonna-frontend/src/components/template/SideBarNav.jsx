import React, { useState } from 'react';
import { NavLink, useLocation } from "react-router-dom";

export default function SideBarNav({setToken}) {

  const location = useLocation();
  const onProfilePage = location.pathname === "/auth";

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
  }

  return (
    <nav className="profile-nav">
      <ul className="profile-nav-list">

        {/* If NOT on profile page → show Profile link */}
        {!onProfilePage && (
          <li>
            <NavLink
              to="/auth"
              className={({ isActive }) => isActive ? "active-link" : ""}
            >
              Profile
            </NavLink>
          </li>
        )}

        {/* If ON profile page → show Edit Profile */}
        {onProfilePage && (
          <li>
            <button
              className="link-button"
              onClick={() => console.log("Edit mode coming soon")}
            >
              Edit Profile
            </button>
          </li>
        )}

        <li>
          <NavLink
            to="/orders"
            className={({ isActive }) => isActive ? "active-link" : ""}
          >
            Past Orders
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/favorites"
            className={({ isActive }) => isActive ? "active-link" : ""}
          >
            Favorites
          </NavLink>
        </li>

        {/* Only show logout on profile page */}
        {onProfilePage && (
          <li>
            <button className="link-button" onClick={logout}>
              Logout
            </button>
          </li>
        )}

      </ul>
    </nav>
  );
}

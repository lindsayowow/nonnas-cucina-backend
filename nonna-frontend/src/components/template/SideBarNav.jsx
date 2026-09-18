import React from "react";
import { NavLink, useLocation } from "react-router-dom";

export default function SideBarNav({ setToken }) {
  const location = useLocation();
  const onProfilePage = location.pathname === "/auth";

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
  }

  return (
    <nav className="sidebar-nav">
      <ul className="sidebar-navigation">

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

        {onProfilePage && (
          <li>
            <button className="link-button">
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

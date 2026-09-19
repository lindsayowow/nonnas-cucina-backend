import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/header.css';
import nonnasLogo from '../../assets/Nonnas_Logo.png';
import useDishBuilderContext from "../../hooks/useDishBuilderContext";

export default function Header() {
  const { yourOrder } = useDishBuilderContext();
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const syncLoginState = () => setIsLoggedIn(!!localStorage.getItem("token"));

    // fires on changes from other tabs
    window.addEventListener("storage", syncLoginState);
    
    // fires on changes from this tab (passed to Auth.jsx & SideBarNav.jsx)
    window.addEventListener("authchange", syncLoginState);

    return () => {
      window.removeEventListener("storage", syncLoginState);
      window.removeEventListener("authchange", syncLoginState);
    };
  }, []);

  return (
    // semantic header
    <header className="header">
      <NavLink to="/" onClick={() => setOpen(false)}>
        <img
          src={nonnasLogo}
          // alt text for accesibility
          alt="Nonna's Kitchen logo showing a drawing of a white-haired grandmother cooking in a kitchen"
          className="logo"
        />
      </NavLink>

      <div className="nonna-font middle">
        {/* semantic title */}
        <NavLink to="/" onClick={() => setOpen(false)}>
          <h1 className="title">Nonna's Cucina</h1>
        </NavLink>
      </div>

      <button
        className="hamburger"
        aria-label="Toggle menu"
        aria-expanded={open}              // accessibility: menu state
        aria-controls="primary-navigation" // accessibility: links the button to the nav
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      <nav
        id="primary-navigation"            // needed for aria-controls
        aria-label="Main navigation"       // accessibility: landmark label
        className={`nav-links ${open ? "open" : ""}`}
      >
        <NavLink to="/" onClick={() => setOpen(false)}>Home</NavLink>
        <NavLink to="/buildadish" onClick={() => setOpen(false)}>Build a Dish</NavLink>
        <NavLink to="/about" onClick={() => setOpen(false)}>About</NavLink>
        <NavLink
          to="/auth"
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            `profile-icon ${isLoggedIn ? "logged-in" : "logged-out"} ${isActive ? "active" : ""}`
          }
          aria-label={isLoggedIn ? "My Account (logged in)" : "Log in or register"}
        >
          👤︎
        </NavLink>
        <NavLink to="/favorites" onClick={() => setOpen(false)} aria-label="Favorites">
          <span aria-hidden="true" className="fav-icon">♥</span>
        </NavLink>

        <NavLink
          to="/cart"
          onClick={() => setOpen(false)}
          aria-label={`Cart with ${yourOrder.length} items`} // accessible label
        >
          <span aria-hidden="true">🛒</span> ({yourOrder.length})
        </NavLink>
      </nav>
    </header>
  );
}
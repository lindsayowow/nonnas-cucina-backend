import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/header.css';
import nonnasLogo from '../assets/Nonnas_Logo.png';
import { useDishBuilderContext } from "../context/DishBuilderContext";

export default function Header() {
  const { yourOrder } = useDishBuilderContext();
  const [open, setOpen] = useState(false);

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

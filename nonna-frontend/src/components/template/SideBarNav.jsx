import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function SideBarNav() {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <nav
                id="primary-navigation"
                aria-label="Main navigation"
                className={`sidebar-nav ${open ? "open" : ""}`}
            >
                <ul className="sidebar-navigation">
                    <li>
                        <NavLink 
                            to="/auth"
                            className={({ isActive }) => isActive ? "active-link" : ""}
                            onClick={() => setOpen(false)}
                        >
                            Profile
                        </NavLink>
                    </li>

                    <li>
                        <NavLink 
                            to="/orders"
                            className={({ isActive }) => isActive ? "active-link" : ""}
                            onClick={() => setOpen(false)}
                        >
                            Past Orders
                        </NavLink>
                    </li>

                    <li>
                        <NavLink 
                            to="/favorites"
                            className={({ isActive }) => isActive ? "active-link" : ""}
                            onClick={() => setOpen(false)}
                        >
                            Favorites
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

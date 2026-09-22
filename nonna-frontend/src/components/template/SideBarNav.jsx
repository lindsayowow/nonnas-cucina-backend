import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import useDishBuilderContext from "../../hooks/useDishBuilderContext";


export default function SideBarNav({ token, onLogout, onEditProfile }) {
  const location = useLocation();

  // Detect if user is currently on the profile page
  const onProfilePage = location.pathname === "/auth";
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // Shared JWT decode helper from context
  const { getUserIdFromToken } = useDishBuilderContext();

  /* DELETE ACCOUNT — MAIN ACTION. Attempts DELETE /users/{id}.
     If user has past orders, falls back to anonymize instead.*/

  async function handleDeleteAccount() {
    setDeleting(true);
    setDeleteError(null);

    const userId = getUserIdFromToken(token);

    try {
      const deleteResponse = await fetch(
        `http://localhost:8080/users/${userId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Token expired or invalid
      if (deleteResponse.status === 401 || deleteResponse.status === 403) {
        onLogout();
        return;
      }

      // Hard delete succeeded
      if (deleteResponse.ok) {
        onLogout();
        return;
      }

      // Has past orders — fallback to anonymization
      if (deleteResponse.status === 409) {
        const anonymizeResponse = await fetch(
          `http://localhost:8080/users/${userId}/anonymize`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (anonymizeResponse.status === 401 || anonymizeResponse.status === 403) {
          onLogout();
          return;
        }

        if (!anonymizeResponse.ok) {
          setDeleteError("Failed to delete account.");
          return;
        }

        onLogout();
        return;
      }

      // Generic failure
      setDeleteError("Failed to delete account.");
    } catch {
      setDeleteError("Error deleting account.");
    } finally {
      setDeleting(false);
    }
  }

  /*  MAIN SIDEBAR NAVIGATION */
  return (
    <nav className="sidebar-nav">
      <ul className="sidebar-navigation">

        {/* Profile link (hidden when already on profile page) */}
        {!onProfilePage && (
          <li>
            <NavLink
              to="/auth"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Profile
            </NavLink>
          </li>
        )}

        {/* Edit Profile button (only visible on profile page) */}
        {onProfilePage && (
          <li>
            <button className="link-button" onClick={onEditProfile}>
              Edit Profile
            </button>
          </li>
        )}

        {/* Past Orders */}
        <li>
          <NavLink
            to="/orders"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Past Orders
          </NavLink>
        </li>

        {/* Favorites */}
        <li>
          <NavLink
            to="/favorites"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Favorites
          </NavLink>
        </li>

        {/* Logout (only visible on profile page) */}
        {onProfilePage && (
          <li>
            <button className="link-button" onClick={onLogout}>
              Logout
            </button>
          </li>
        )}

        {/* Delete Account — initial trigger */}
        {onProfilePage && !confirmingDelete && (
          <li>
            <button
              className="link-button"
              onClick={() => {
                setConfirmingDelete(true);
                setDeleteError(null); // clear old errors
              }}
            >
              Delete Account
            </button>
          </li>
        )}

        {/* Delete Account — confirmation dialog */}
        {onProfilePage && confirmingDelete && (
          <li className="sidebar-delete-confirm">
            <p>Delete your account?</p>

            {/* Updated layout: buttons stacked vertically */}
            <div className="delete-confirm-actions">
              <button
                className="link-button"
                disabled={deleting}
                onClick={handleDeleteAccount}
              >
                {deleting ? "Deleting..." : "Yes, delete"}
              </button>

              {/* NEW CLASS: delete-confirm-cancel */}
              <button
                className="delete-confirm-cancel"
                disabled={deleting}
                onClick={() => setConfirmingDelete(false)}
              >
                Cancel
              </button>
            </div>

            {/* Error message */}
            {deleteError && (
              <p className="sidebar-delete-error">{deleteError}</p>
            )}
          </li>
        )}

      </ul>
    </nav>
  );
}

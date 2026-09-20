import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

// token: current JWT, used to authorize the delete/anonymize requests below
// onLogout: shared session-clear callback from Auth.jsx -- used both for the
//   Logout button and after a successful delete/anonymize, so there's a
//   single place that clears localStorage + app state instead of this
//   component keeping its own duplicate copy of that logic.
export default function SideBarNav({ token, onLogout, onEditProfile }) {
  const location = useLocation();
  const onProfilePage = location.pathname === "/auth";

  // Delete-account flow state
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  function getUserIdFromToken(token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return Number(payload.sub);
    } catch {
      // Malformed/invalid token -- treat as no user
      return null;
    }
  }

  // DELETE -- tries a real account deletion first. If the account has past
  // orders, the backend responds 409 and this falls back to POST /anonymize
  // so order/kitchen-management history is preserved instead of lost.
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

      if (deleteResponse.status === 401 || deleteResponse.status === 403) {
        onLogout();
        return;
      }

      if (deleteResponse.ok) {
        // Hard delete succeeded -- log out
        onLogout();
        return;
      }

      if (deleteResponse.status === 409) {
        // Has past orders -- fall back to anonymizing instead of deleting
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

      setDeleteError("Failed to delete account.");
    } catch {
      setDeleteError("Error deleting account.");
    } finally {
      setDeleting(false);
    }
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
            <button className="link-button" onClick={onEditProfile}>
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
            <button className="link-button" onClick={onLogout}>
              Logout
            </button>
          </li>
        )}

        {/* Delete Account -- profile page only, with its own confirm step */}
        {onProfilePage && !confirmingDelete && (
          <li>
            <button
              className="link-button"
              onClick={() => setConfirmingDelete(true)}
            >
              Delete Account
            </button>
          </li>
        )}

        {onProfilePage && confirmingDelete && (
          <li className="sidebar-delete-confirm">
            <p>Delete your account?</p>

            <button
              className="link-button"
              disabled={deleting}
              onClick={handleDeleteAccount}
            >
              {deleting ? "Deleting..." : "Yes, delete"}
            </button>

            <button
              className="link-button"
              disabled={deleting}
              onClick={() => setConfirmingDelete(false)}
            >
              Cancel
            </button>

            {deleteError && <p className="sidebar-delete-error">{deleteError}</p>}
          </li>
        )}

      </ul>
    </nav>
  );
}

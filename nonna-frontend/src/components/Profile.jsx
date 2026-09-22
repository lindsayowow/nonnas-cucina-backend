import { useState, useEffect } from "react";
import AuthButton from "./buttons/AuthButton";
import useDishBuilderContext from "../hooks/useDishBuilderContext";
import formatPhoneNumber from "../utils/formatPhoneNumber";
import "../styles/profile.css";

export default function Profile({ token, editing, setEditing, onSessionExpired }) {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: ""
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  // Load failure state, 
  const [loadError, setLoadError] = useState(null);

  const { getUserIdFromToken } = useDishBuilderContext();
  const userId = getUserIdFromToken(token);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch(
          `http://localhost:8080/users/profile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUser(data);
          setForm({
            firstName: data.firstName ?? "",
            lastName: data.lastName ?? "",
            email: data.email ?? "",
            phoneNumber: data.phoneNumber ?? ""
          });
        } else if (response.status === 401 || response.status === 403) {
          // If token was rejected by the server, clear it automatically
          onSessionExpired?.();
        } else {
          setLoadError("Failed to load your profile.");
        }
      } catch {
        setLoadError("Error loading your profile.");
      }
    }

    if (userId) {
      fetchUser();
    }
  }, [userId, token, onSessionExpired]);

  function handleChange(e) {
    let { name, value } = e.target;
    // Force phone number into 555-555-5555 format 
    if (name === "phoneNumber") value = formatPhoneNumber(value);
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleCancel() {
    if (user) {
      setForm({
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        email: user.email ?? "",
        phoneNumber: user.phoneNumber ?? ""
      });
    }
    setError(null);
    setEditing(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:8080/users/profile/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form)
        }
      );

      if (response.status === 401 || response.status === 403) {
        onSessionExpired?.();
        return;
      }

      if (!response.ok) {
        setError("Failed to update profile.");
        setSaving(false);
        return;
      }

      const updated = await response.json();
      setUser(updated);
      setEditing(false);
    } catch {
      setError("Error updating profile.");
    } finally {
      setSaving(false);
    }
  }

  if (!user) {
    return (
      <div>
        <p>{loadError ?? "Loading profile..."}</p>

        {/* Manual fallback in case token misses 401/403 auto-clear */}
        {loadError && (
          <button className="switch-link" onClick={() => onSessionExpired?.()}>
            Log in again
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="profile-card">
      <h2 className="profile-title">My Profile</h2>

      {!editing && (
        <div className="profile-content">
          <p>
            <strong>First Name:</strong> {user.firstName}
          </p>
          <p>
            <strong>Last Name:</strong> {user.lastName}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Phone Number:</strong> {user.phoneNumber}
          </p>
        </div>
      )}

      {editing && (
        <form className="profile-content" onSubmit={handleSubmit}>
          <label>
            First Name
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Last Name
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Phone Number
            <input
              type="tel"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
            />
          </label>

          {error && <p className="profile-error">{error}</p>}

          <div className="profile-actions">
            <AuthButton type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </AuthButton>

            <AuthButton type="button" onClick={handleCancel}>
              Cancel
            </AuthButton>
          </div>
        </form>
      )}
    </div>
  );
}

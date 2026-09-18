import { useState, useEffect } from "react";
import AuthButton from "./buttons/AuthButton";
import "../styles/profile.css";

export default function Profile({ token, editing, setEditing }) {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: ""
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function getUserIdFromToken(token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return Number(payload.sub);
    } catch (err) {
      console.error("Invalid token", err);
      return null;
    }
  }

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
        } else {
          console.error("Failed to fetch user");
        }
      } catch (err) {
        console.error("Error fetching user", err);
      }
    }

    if (userId) {
      fetchUser();
    }
  }, [userId, token]);

  function handleChange(e) {
    const { name, value } = e.target;
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

      if (!response.ok) {
        setError("Failed to update profile.");
        setSaving(false);
        return;
      }

      const updated = await response.json();
      setUser(updated);
      setEditing(false);
    } catch (err) {
      console.error("Error updating profile", err);
      setError("Error updating profile.");
    } finally {
      setSaving(false);
    }
  }

  if (!user) {
    return <p>Loading profile...</p>;
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
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthButton from "./buttons/AuthButton";

export default function Profile({ token, setToken }) {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);

  function getUserIdFromToken(token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return Number(payload.sub);   // ⭐ FIXED: ensure numeric ID
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
          `http://localhost:8080/users/profile/${userId}`,   // ⭐ FIXED: correct endpoint
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUser(data);
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

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
  }

  if (!user) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="profile-view">
      <h2>My Profile</h2>

      {!editing && (
        <>
          <p><strong>First Name:</strong> {user.firstName}</p>
          <p><strong>Last Name:</strong> {user.lastName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone Number:</strong> {user.phoneNumber}</p>

          <Link to="/favorites">
            <AuthButton>View Favorites ❤️</AuthButton>
          </Link>

          <Link to="/orders">
            <AuthButton>View Past Orders 📜</AuthButton>
          </Link>

          <AuthButton onClick={() => setEditing(true)}>
            Edit Profile
          </AuthButton>

          <AuthButton onClick={logout}>
            Logout
          </AuthButton>
        </>
      )}

      {editing && (
        <>
          <p>Edit mode coming soon…</p>

          <AuthButton onClick={() => setEditing(false)}>
            Cancel
          </AuthButton>
        </>
      )}
    </div>
  );
}

import { useState } from "react";
import AuthButton from "../../components/buttons/AuthButton";

export default function RegisterForm({ switchToLogin }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  // Email validation
  const validEmail = /\S+@\S+\.\S+/.test(formData.email.trim());
  const emailHasError =
    formData.email.trim().length > 0 && !validEmail;

  // Password complexity checks
  const hasUppercase = /[A-Z]/.test(formData.password);
  const hasLowercase = /[a-z]/.test(formData.password);
  const hasNumber = /[0-9]/.test(formData.password);
  const hasSymbol = /[^A-Za-z0-9]/.test(formData.password);
  const hasMinLength = formData.password.length >= 8;

  const passwordIsValid =
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasSymbol &&
    hasMinLength;

  // Password match check
  const passwordsMatch =
    formData.password.trim().length > 0 &&
    formData.password === formData.confirmPassword;

  // Disable submit until everything is valid
  const isIncomplete =
    formData.firstName.trim().length === 0 ||
    formData.lastName.trim().length === 0 ||
    formData.phoneNumber.trim().length === 0 ||
    formData.email.trim().length === 0 ||
    formData.password.trim().length === 0 ||
    formData.confirmPassword.trim().length === 0 ||
    !validEmail ||
    !passwordIsValid ||
    !passwordsMatch;

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  async function handleRegister(e) {
    e.preventDefault();

    if (!validEmail) {
      alert("Please enter a valid email.");
      return;
    }

    if (!passwordIsValid) {
      alert(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol."
      );
      return;
    }

    if (!passwordsMatch) {
      alert("Passwords do not match.");
      return;
    }

    // Backend expects full DTO fields
    const payload = {
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phoneNumber: formData.phoneNumber,
      password: formData.password
    };

    const response = await fetch("http://localhost:8080/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      alert("Account created!");
      switchToLogin();
    } else {
      alert("Registration failed — email may already exist.");
    }
  }

  return (
    <div className="register-form">
      <h2>Create Account</h2>

      <form onSubmit={handleRegister}>

        {/* First Name */}
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />

        {/* Last Name */}
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />

        {/* Phone Number */}
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          aria-required="true"
          aria-invalid={emailHasError}
          aria-describedby={emailHasError ? "email-error" : undefined}
        />

        {emailHasError && (
          <p id="email-error" className="inputError">
            Please enter a valid email.
          </p>
        )}

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          aria-invalid={!passwordIsValid && formData.password.length > 0}
        />

        {/* Password complexity errors */}
        {!passwordIsValid && formData.password.length > 0 && (
          <ul className="inputError">
            {!hasUppercase && <li>Must include an uppercase letter</li>}
            {!hasLowercase && <li>Must include a lowercase letter</li>}
            {!hasNumber && <li>Must include a number</li>}
            {!hasSymbol && <li>Must include a symbol</li>}
            {!hasMinLength && <li>Must be at least 8 characters</li>}
          </ul>
        )}

        {/* Confirm Password */}
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          aria-invalid={!passwordsMatch && formData.confirmPassword.length > 0}
        />

        {!passwordsMatch && formData.confirmPassword.length > 0 && (
          <p className="inputError">Passwords do not match.</p>
        )}

        <AuthButton
          type="submit"
          disabled={isIncomplete}
          ariaDisabled={isIncomplete}
        >
          Register
        </AuthButton>
      </form>

      <p onClick={switchToLogin} className="switch-link">
        Already have an account?
      </p>
    </div>
  );
}

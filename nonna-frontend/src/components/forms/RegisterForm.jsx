import { useState } from "react";
import AuthButton from "../../components/buttons/AuthButton";
import "../../styles/form.css";

export default function RegisterForm({ switchToLogin }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  function formatPhoneNumber(value) {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  function handleChange(e) {
    let { name, value } = e.target;
    if (name === "phoneNumber") value = formatPhoneNumber(value);
    setFormData({ ...formData, [name]: value });
  }

  const validEmail = /\S+@\S+\.\S+/.test(formData.email.trim());
  const emailHasError = formData.email.trim().length > 0 && !validEmail;

  const hasUppercase = /[A-Z]/.test(formData.password);
  const hasLowercase = /[a-z]/.test(formData.password);
  const hasNumber = /[0-9]/.test(formData.password);
  const hasSymbol = /[^A-Za-z0-9]/.test(formData.password);
  const hasMinLength = formData.password.length >= 8;

  const passwordIsValid =
    hasUppercase && hasLowercase && hasNumber && hasSymbol && hasMinLength;

  const passwordsMatch =
    formData.password.trim().length > 0 &&
    formData.password === formData.confirmPassword;

  // NEW VALIDATION
  const firstNameValid = formData.firstName.trim().length >= 2;
  const lastNameValid = formData.lastName.trim().length >= 2;

  const isIncomplete =
    !firstNameValid ||
    !lastNameValid ||
    !formData.phoneNumber.trim() ||
    !formData.email.trim() ||
    !formData.password.trim() ||
    !formData.confirmPassword.trim() ||
    !validEmail ||
    !passwordIsValid ||
    !passwordsMatch;

  async function handleRegister(e) {
    e.preventDefault();

    if (!firstNameValid) {
      alert("First name must be at least 2 characters.");
      return;
    }

    if (!lastNameValid) {
      alert("Last name must be at least 2 characters.");
      return;
    }

    if (!validEmail) {
      alert("Please enter a valid email.");
      return;
    }

    if (!passwordIsValid) {
      alert("Password must meet complexity requirements.");
      return;
    }

    if (!passwordsMatch) {
      alert("Passwords do not match.");
      return;
    }

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
    <div className="card register-card">
      <form className="register-form-container" onSubmit={handleRegister}>
        <h2>Create Account</h2>

        <div className="register-form-row">
          <label htmlFor="firstName">
            First Name <span className="required-asterisk">*</span>
          </label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Please enter your first name."
            required
          />
          {!firstNameValid && formData.firstName.length > 0 && (
            <p className="inputError">First name must be at least 2 characters.</p>
          )}
        </div>

        <div className="register-form-row">
          <label htmlFor="lastName">
            Last Name <span className="required-asterisk">*</span>
          </label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Please enter your last name."
            required
          />
          {!lastNameValid && formData.lastName.length > 0 && (
            <p className="inputError">Last name must be at least 2 characters.</p>
          )}
        </div>

        <div className="register-form-row">
          <label htmlFor="phoneNumber">
            Phone Number <span className="required-asterisk">*</span>
          </label>
          <input
            id="phoneNumber"
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            placeholder="555-555-5555"
          />
        </div>

        <div className="register-form-row">
          <label htmlFor="email">
            Email <span className="required-asterisk">*</span>
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Please enter your email."
            required
            aria-invalid={emailHasError}
          />
        </div>

        {emailHasError && (
          <p className="inputError">Please enter a valid email.</p>
        )}

        <div className="register-form-row">
          <label htmlFor="password">
            Password <span className="required-asterisk">*</span>
          </label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder=" min 8 char, upper and lower case, symbol and number."
            required
          />
        </div>

        {!passwordIsValid && formData.password.length > 0 && (
          <ul className="inputError">
            {!hasUppercase && <li>Must include an uppercase letter</li>}
            {!hasLowercase && <li>Must include a lowercase letter</li>}
            {!hasNumber && <li>Must include a number</li>}
            {!hasSymbol && <li>Must include a symbol</li>}
            {!hasMinLength && <li>Must be at least 8 characters</li>}
          </ul>
        )}

        <div className="register-form-row">
          <label htmlFor="confirmPassword">
            Confirm Password <span className="required-asterisk">*</span>
          </label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

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

        <p onClick={switchToLogin} className="switch-link">
          Already have an account?
        </p>
      </form>
    </div>
  );
}

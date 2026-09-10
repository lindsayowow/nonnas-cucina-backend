import { useState } from "react";
import AuthButton from "../buttons/AuthButton";

export default function LoginForm({ setToken, switchToRegister }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin(e) {
        e.preventDefault();

        const payload = {
            username: email, // backend expects "username"
            password
        };

        const response = await fetch("http://localhost:8080/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.token) {
            setToken(data.token);
        } else {
            alert("Invalid login.");
        }
    }

    const isIncomplete =
        email.trim().length === 0 || password.trim().length === 0;

    return (
        <div className="login-form">
            <h2>Login</h2>

            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    required
                    onChange={e => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    required
                    onChange={e => setPassword(e.target.value)}
                />

                <AuthButton
                    type="submit"
                    disabled={isIncomplete}
                    ariaDisabled={isIncomplete}
                >
                    Login
                </AuthButton>
            </form>

            <p onClick={switchToRegister} className="switch-link">
                Create an account
            </p>
        </div>
    );
}

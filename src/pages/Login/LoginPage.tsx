import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import React, { useState } from "react";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const { signIn, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // redirect to dashboard if already logged in
  if (!isLoading && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      await signIn(identifier, password);

      navigate("/");
    } catch (err: any) {
      setError(err?.message ?? "Login failed");
    }
  }

  return (
    <div className={styles.authPage}>
      <div className={styles.authShell}>

        <h1 className={styles.authTitle}>Login</h1>

        <form className={styles.authForm} onSubmit={handleSubmit}>
          <input
            className={styles.authInput}
            type="text"
            placeholder="Email or Username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            autoComplete="username"
            required
          />

          <input
            className={styles.authInput}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          {error && (
            <div className={styles.authError} role="alert">
              {error}
            </div>
          )}

          <button className={styles.authButton} type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

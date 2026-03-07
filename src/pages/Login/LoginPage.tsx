import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import { useState, type SyntheticEvent } from "react";
import styles from "./LoginPage.module.css";
import { GoAlertFill } from "react-icons/go";

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

  // Validators
  const identifierInvalid = !identifier.trim();
  const passwordInvalid = !password.trim();
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    setError(null);

    if (!identifier.trim() || !password.trim()) return;

    try {
      await signIn(identifier, password);
      navigate("/");
    } catch (err: any) {
      setError(err?.message ?? "Login failed");
    }
  }

  return (
    <div className={styles.authPage}>
      <div className={styles.authContent}>
        <div className={styles.authTitleGroup}>
          <h1 className={styles.authTitle}>JinjaMonogatari</h1>
          <p className={styles.authSubtitle}>Sign in to access the CMS.</p>
        </div>

        <div className="card">
          <form className={styles.authForm} onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label" htmlFor="identifier">
                Email or Username
              </label>
              <input
                id="identifier"
                className={`input ${
                  submitted && identifierInvalid ? "input-error" : ""
                }`}
                type="text"
                placeholder="Email or Username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoComplete="username"
              />
              {submitted && identifierInvalid && (
                <div className="text-sm text-issue">This field is required</div>
              )}
            </div>

            <div className="form-group">
              <label className="label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                className={`input ${
                  submitted && passwordInvalid ? "input-error" : ""
                }`}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              {submitted && passwordInvalid && (
                <div className="text-sm text-issue">This field is required</div>
              )}
            </div>

            {error && (
              <div className={styles.authError} role="alert">
                <GoAlertFill />
                <span>{error}</span>
              </div>
            )}

            <button className="btn btn-primary" type="submit" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

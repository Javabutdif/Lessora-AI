import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../services/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await loginAdmin(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        color: "#fff",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          background: "rgba(5,11,22,0.88)",
          border: "1px solid rgba(148,163,184,0.24)",
          borderRadius: "24px",
          padding: "28px",
          boxShadow: "0 28px 80px rgba(0,0,0,0.35)",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <p
            style={{
              margin: "0 0 8px",
              color: "#60a5fa",
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
            }}
          >
            Admin Portal
          </p>
          <h1 style={{ margin: "0", fontSize: "32px" }}>Sign in</h1>
          <p style={{ margin: "10px 0 0", color: "rgba(255,255,255,0.7)" }}>
            Use administrator credentials to open the administrator dashboard.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "14px" }}
        >
          <label
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
          >
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="admin@example.com"
              style={{
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1px solid rgba(148,163,184,0.28)",
                background: "#020817",
                color: "#fff",
              }}
            />
          </label>

          <label
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
          >
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              placeholder="Enter password"
              style={{
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1px solid rgba(148,163,184,0.28)",
                background: "#020817",
                color: "#fff",
              }}
            />
          </label>

          {error ? (
            <div
              style={{
                borderRadius: "10px",
                padding: "10px 12px",
                background: "rgba(239,68,68,0.18)",
                color: "#fecdd3",
                border: "1px solid rgba(248,113,113,0.3)",
              }}
            >
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              borderRadius: "10px",
              padding: "12px 16px",
              border: "none",
              background: "linear-gradient(90deg, #2563eb, #0f766e)",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            {isLoading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

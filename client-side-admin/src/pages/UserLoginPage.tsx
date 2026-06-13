import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/api";
import LessoraLogo from "../assets/Transparent Logo.png";

export default function UserLoginPage() {
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
      await loginUser(email, password);
      navigate("/generate");
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
        background: "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
        color: "#0f172a",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          background: "#fff",
          border: "1px solid #dbe4f0",
          borderRadius: "24px",
          padding: "32px",
          boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <img
            src={LessoraLogo}
            alt="Lessora AI"
            style={{ width: "180px", height: "auto", objectFit: "contain" }}
          />
        </div>
        <h1
          style={{
            margin: "0 0 8px",
            fontSize: "28px",
            fontWeight: "800",
            textAlign: "center",
            color: "#475569",
          }}
        >
          Welcome Back
        </h1>
        <p
          style={{
            margin: "0 0 24px",
            color: "#475569",
            textAlign: "center",
            fontSize: "14px",
          }}
        >
          Sign in to continue planning with Lessora AI
        </p>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <label
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
          >
            <span style={{ fontSize: "14px", fontWeight: "600" }}>Email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="teacher@school.edu"
              disabled={isLoading}
              style={{
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                background: "#fff",
                color: "#0f172a",
                fontSize: "14px",
              }}
            />
          </label>
          <label
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
          >
            <span style={{ fontSize: "14px", fontWeight: "600" }}>
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              disabled={isLoading}
              style={{
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                background: "#fff",
                color: "#0f172a",
                fontSize: "14px",
              }}
            />
          </label>
          {error && (
            <div
              style={{
                borderRadius: "10px",
                padding: "12px",
                background: "#fef2f2",
                color: "#b91c1c",
                border: "1px solid #fecaca",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              borderRadius: "10px",
              padding: "14px 16px",
              border: "none",
              background: "linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "15px",
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <div
          style={{ marginTop: "16px", textAlign: "center", fontSize: "14px" }}
        >
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
        <div
          style={{
            marginTop: "24px",
            textAlign: "center",
            fontSize: "14px",
            color: "#475569",
          }}
        >
          Don't have an account? <Link to="/register">Sign Up</Link>
        </div>
        <div
          style={{ marginTop: "16px", textAlign: "center", fontSize: "13px" }}
        >
          <Link to="/">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

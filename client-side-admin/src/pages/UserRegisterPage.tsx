import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/api";
import LessoraLogo from "../assets/Transparent Logo.png";

export default function UserRegisterPage() {
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");
    if (password !== confirmPassword)
      return (setError("Passwords do not match"), setIsLoading(false));
    if (password.length < 6)
      return (
        setError("Password must be at least 6 characters"),
        setIsLoading(false)
      );
    try {
      setSuccess(await registerUser({ name, email, password, school }));
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
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
          Create Account
        </h1>
        <p
          style={{
            margin: "0 0 24px",
            color: "#475569",
            textAlign: "center",
            fontSize: "14px",
          }}
        >
          Join Lessora AI and start creating lesson plans
        </p>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          {["Name", "School", "Email", "Password", "Confirm Password"].map(
            (label, i) => null,
          )}
          <label
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
          >
            <span style={{ fontSize: "14px", fontWeight: "600" }}>Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
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
            <span style={{ fontSize: "14px", fontWeight: "600" }}>School</span>
            <input
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="School Name (Optional)"
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
            <span style={{ fontSize: "14px", fontWeight: "600" }}>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="teacher@school.edu"
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
              placeholder="At least 6 characters"
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
              Confirm Password
            </span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Re-enter your password"
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
          {success && (
            <div
              style={{
                borderRadius: "10px",
                padding: "12px",
                background: "#ecfdf5",
                color: "#166534",
                border: "1px solid #bbf7d0",
                fontSize: "14px",
              }}
            >
              {success}
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
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        <div
          style={{
            marginTop: "24px",
            textAlign: "center",
            fontSize: "14px",
            color: "#475569",
          }}
        >
          Already have an account? <Link to="/login">Sign In</Link>
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

import { useState, FormEvent } from "react";
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

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      const message = await registerUser({ name, email, password, school });
      setSuccess(message);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
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
        color: "#fff",
        background:
          "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1425 100%)",
      }}
    >
      {/* Decorative elements */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-50%",
            right: "-10%",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(59, 130, 246, 0.15), transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-30%",
            left: "-5%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(124, 58, 237, 0.12), transparent 70%)",
          }}
        />
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          background: "rgba(5,11,22,0.88)",
          border: "1px solid rgba(148,163,184,0.24)",
          borderRadius: "24px",
          padding: "32px",
          boxShadow: "0 28px 80px rgba(0,0,0,0.35)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <img
            src={LessoraLogo}
            alt="Lessora AI"
            style={{
              width: "180px",
              height: "auto",
              objectFit: "contain",
              filter: "drop-shadow(0 10px 20px rgba(59, 130, 246, 0.2))",
            }}
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <h1
            style={{
              margin: "0 0 8px",
              fontSize: "28px",
              fontWeight: "800",
              textAlign: "center",
            }}
          >
            Create Account
          </h1>
          <p
            style={{
              margin: "0",
              color: "rgba(255,255,255,0.7)",
              textAlign: "center",
              fontSize: "14px",
            }}
          >
            Join Lessora AI and start creating lesson plans
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <label
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
          >
            <span style={{ fontSize: "14px", fontWeight: "600" }}>Name</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              placeholder="Your full name"
              disabled={isLoading}
              style={{
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1px solid rgba(148,163,184,0.28)",
                background: "#020817",
                color: "#fff",
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.5)")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "rgba(148,163,184,0.28)")
              }
            />
          </label>

          <label
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
          >
            <span style={{ fontSize: "14px", fontWeight: "600" }}>School</span>
            <input
              type="text"
              value={school}
              onChange={(event) => setSchool(event.target.value)}
              placeholder="School Name (Optional)"
              disabled={isLoading}
              style={{
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1px solid rgba(148,163,184,0.28)",
                background: "#020817",
                color: "#fff",
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.5)")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "rgba(148,163,184,0.28)")
              }
            />
          </label>

          <label
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
          >
            <span style={{ fontSize: "14px", fontWeight: "600" }}>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="teacher@school.edu"
              disabled={isLoading}
              style={{
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1px solid rgba(148,163,184,0.28)",
                background: "#020817",
                color: "#fff",
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.5)")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "rgba(148,163,184,0.28)")
              }
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
              onChange={(event) => setPassword(event.target.value)}
              required
              placeholder="At least 6 characters"
              disabled={isLoading}
              style={{
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1px solid rgba(148,163,184,0.28)",
                background: "#020817",
                color: "#fff",
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.5)")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "rgba(148,163,184,0.28)")
              }
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
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              placeholder="Re-enter your password"
              disabled={isLoading}
              style={{
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1px solid rgba(148,163,184,0.28)",
                background: "#020817",
                color: "#fff",
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.5)")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "rgba(148,163,184,0.28)")
              }
            />
          </label>

          {error && (
            <div
              style={{
                borderRadius: "10px",
                padding: "12px",
                background: "rgba(239,68,68,0.18)",
                color: "#fecdd3",
                border: "1px solid rgba(248,113,113,0.3)",
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
                background: "rgba(34,197,94,0.18)",
                color: "#bbf7d0",
                border: "1px solid rgba(74,222,128,0.3)",
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
              cursor: isLoading ? "not-allowed" : "pointer",
              fontWeight: 700,
              fontSize: "15px",
              transition: "all 0.3s",
              opacity: isLoading ? 0.7 : 1,
              boxShadow: "0 8px 24px rgba(59, 130, 246, 0.3)",
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 32px rgba(59, 130, 246, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 8px 24px rgba(59, 130, 246, 0.3)";
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
            color: "rgba(255,255,255,0.7)",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "#60a5fa",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Sign In
          </Link>
        </div>

        <div
          style={{
            marginTop: "16px",
            textAlign: "center",
            fontSize: "13px",
          }}
        >
          <Link
            to="/"
            style={{
              color: "rgba(255,255,255,0.5)",
              textDecoration: "none",
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

// Made with Bob

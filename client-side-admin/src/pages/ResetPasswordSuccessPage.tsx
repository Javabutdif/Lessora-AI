export default function ResetPasswordSuccessPage() {
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
          padding: "40px 28px",
          boxShadow: "0 28px 80px rgba(0,0,0,0.35)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            margin: "0 auto 24px",
            background: "rgba(34, 197, 85, 0.1)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "32px",
          }}
        >
          ✓
        </div>

        <h1 style={{ margin: "0 0 12px", fontSize: "28px" }}>Password reset</h1>
        <p style={{ margin: "0 0 12px", color: "rgba(255,255,255,0.7)" }}>
          Your password has been successfully reset.
        </p>
        <p
          style={{
            margin: "0 0 24px",
            color: "rgba(255,255,255,0.6)",
            fontSize: "14px",
          }}
        >
          You can now sign in with your new password.
        </p>

        <a
          href="/login"
          style={{
            display: "inline-block",
            padding: "12px 32px",
            borderRadius: "10px",
            background: "#60a5fa",
            color: "#fff",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "600",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#3b82f6")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#60a5fa")}
        >
          Back to login
        </a>
      </div>
    </div>
  );
}

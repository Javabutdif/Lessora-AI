export default function ResetPasswordSuccessPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", background: "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)", color: "#0f172a" }}>
      <div style={{ width: "100%", maxWidth: "440px", background: "#fff", border: "1px solid #dbe4f0", borderRadius: "24px", padding: "40px 28px", boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08)", textAlign: "center" }}>
        <div style={{ width: "64px", height: "64px", margin: "0 auto 24px", background: "#dcfce7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px" }}>
          ✓
        </div>
        <h1 style={{ margin: "0 0 12px", fontSize: "28px" }}>Password reset</h1>
        <p style={{ margin: "0 0 12px", color: "#475569" }}>Your password has been successfully reset.</p>
        <p style={{ margin: "0 0 24px", color: "#64748b", fontSize: "14px" }}>You can now sign in with your new password.</p>
        <a href="/login" style={{ display: "inline-block", padding: "12px 32px", borderRadius: "10px", background: "linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%)", color: "#fff", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>Back to login</a>
      </div>
    </div>
  );
}

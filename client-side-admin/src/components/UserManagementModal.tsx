import { useState } from "react";
import { updateUser, User } from "../services/api";

interface UserManagementModalProps {
  user: User;
  onClose: () => void;
  onUserUpdated: (user: User) => void;
}

export default function UserManagementModal({
  user,
  onClose,
  onUserUpdated,
}: UserManagementModalProps) {
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    status: User["status"];
  }>({
    name: user.name,
    email: user.email,
    status: user.status,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const updatedUser = await updateUser(user.id, formData);
      onUserUpdated(updatedUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "linear-gradient(180deg, #020817, #040b18 35%, #01060f)",
          border: "1px solid rgba(96,165,250,0.22)",
          borderRadius: "24px",
          padding: "28px",
          maxWidth: "500px",
          width: "90%",
          maxHeight: "80vh",
          overflowY: "auto",
          color: "#fff",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "24px",
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: "24px" }}>Edit User</h2>
            <p
              style={{
                margin: "8px 0 0",
                color: "rgba(255,255,255,0.6)",
                fontSize: "14px",
              }}
            >
              Update user information
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "rgba(255,255,255,0.6)",
              fontSize: "24px",
              cursor: "pointer",
              padding: 0,
            }}
          >
            ×
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              borderRadius: "12px",
              padding: "12px 14px",
              background: "rgba(239,68,68,0.16)",
              color: "#fecdd3",
              border: "1px solid rgba(248,113,113,0.26)",
              marginBottom: "16px",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div style={{ marginBottom: "18px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "rgba(255,255,255,0.8)",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid rgba(148,163,184,0.3)",
                background: "rgba(5,11,22,0.5)",
                color: "#fff",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
              required
            />
          </div>

          {/* Email Field */}
          <div style={{ marginBottom: "18px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "rgba(255,255,255,0.8)",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid rgba(148,163,184,0.3)",
                background: "rgba(5,11,22,0.5)",
                color: "#fff",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
              required
            />
          </div>

          {/* Status Field */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "rgba(255,255,255,0.8)",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as User["status"],
                })
              }
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid rgba(148,163,184,0.3)",
                background: "rgba(5,11,22,0.5)",
                color: "#fff",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                borderRadius: "8px",
                border: "1px solid rgba(148,163,184,0.4)",
                background: "transparent",
                color: "#fff",
                cursor: "pointer",
                padding: "10px 16px",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                borderRadius: "8px",
                border: "none",
                background: "#60a5fa",
                color: "#fff",
                cursor: loading ? "not-allowed" : "pointer",
                padding: "10px 16px",
                fontSize: "14px",
                fontWeight: 600,
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

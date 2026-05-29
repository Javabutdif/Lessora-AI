import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUsers, softDeleteUser, User } from "../services/api";
import UserManagementModal from "../components/UserManagementModal";

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(userId: string) {
    if (
      !window.confirm(
        "Are you sure you want to soft delete this user? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      await softDeleteUser(userId);
      setUsers(users.filter((u) => u.id !== userId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
    }
  }

  function handleEdit(user: User) {
    setSelectedUser(user);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setSelectedUser(null);
  }

  function handleUserUpdated(updatedUser: User) {
    setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    handleCloseModal();
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "#22c55e";
      case "inactive":
        return "#ef4444";
      case "pending":
        return "#f59e0b";
      default:
        return "#94a3b8";
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        color: "#fff",
        padding: "24px",
        background: "linear-gradient(180deg, #020817, #040b18 35%, #01060f)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "24px",
            borderRadius: "24px",
            padding: "18px 20px",
            background: "rgba(5,11,22,0.86)",
            border: "1px solid rgba(96,165,250,0.22)",
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 6px",
                color: "#60a5fa",
                fontSize: "12px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              User Management
            </p>
            <h1 style={{ margin: 0, fontSize: "30px" }}>Manage users</h1>
            <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.68)" }}>
              View, edit, and manage platform users.
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            style={{
              borderRadius: "10px",
              border: "1px solid rgba(148,163,184,0.4)",
              background: "#020817",
              color: "#fff",
              cursor: "pointer",
              padding: "9px 12px",
            }}
          >
            Back to Dashboard
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
            }}
          >
            {error}
          </div>
        )}

        {/* Users Table */}
        <div
          style={{
            borderRadius: "24px",
            padding: "18px",
            background: "rgba(5,11,22,0.86)",
            border: "1px solid rgba(148,163,184,0.18)",
            overflowX: "auto",
          }}
        >
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              No users found.
            </div>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr
                  style={{ borderBottom: "1px solid rgba(148,163,184,0.18)" }}
                >
                  <th
                    style={{
                      textAlign: "left",
                      padding: "12px",
                      color: "rgba(255,255,255,0.7)",
                      fontSize: "12px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    Name
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "12px",
                      color: "rgba(255,255,255,0.7)",
                      fontSize: "12px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    Email
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "12px",
                      color: "rgba(255,255,255,0.7)",
                      fontSize: "12px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "12px",
                      color: "rgba(255,255,255,0.7)",
                      fontSize: "12px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    Created
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "12px",
                      color: "rgba(255,255,255,0.7)",
                      fontSize: "12px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    style={{
                      borderBottom: "1px solid rgba(148,163,184,0.1)",
                    }}
                  >
                    <td
                      style={{
                        padding: "12px",
                        color: "#fff",
                      }}
                    >
                      {user.name}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        color: "rgba(255,255,255,0.8)",
                        fontSize: "14px",
                      }}
                    >
                      {user.email}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 8px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: 600,
                          textTransform: "capitalize",
                          background: `${getStatusColor(user.status)}22`,
                          color: getStatusColor(user.status),
                          border: `1px solid ${getStatusColor(user.status)}44`,
                        }}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        color: "rgba(255,255,255,0.6)",
                        fontSize: "13px",
                      }}
                    >
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        display: "flex",
                        gap: "8px",
                      }}
                    >
                      <button
                        onClick={() => handleEdit(user)}
                        style={{
                          borderRadius: "6px",
                          border: "1px solid rgba(96,165,250,0.4)",
                          background: "rgba(96,165,250,0.1)",
                          color: "#60a5fa",
                          cursor: "pointer",
                          padding: "6px 12px",
                          fontSize: "12px",
                          fontWeight: 600,
                          transition: "all 0.2s",
                        }}
                        onMouseOver={(e) => {
                          const btn = e.currentTarget;
                          btn.style.background = "rgba(96,165,250,0.2)";
                        }}
                        onMouseOut={(e) => {
                          const btn = e.currentTarget;
                          btn.style.background = "rgba(96,165,250,0.1)";
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        style={{
                          borderRadius: "6px",
                          border: "1px solid rgba(239,68,68,0.4)",
                          background: "rgba(239,68,68,0.1)",
                          color: "#ef4444",
                          cursor: "pointer",
                          padding: "6px 12px",
                          fontSize: "12px",
                          fontWeight: 600,
                          transition: "all 0.2s",
                        }}
                        onMouseOver={(e) => {
                          const btn = e.currentTarget;
                          btn.style.background = "rgba(239,68,68,0.2)";
                        }}
                        onMouseOut={(e) => {
                          const btn = e.currentTarget;
                          btn.style.background = "rgba(239,68,68,0.1)";
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* User Management Modal */}
        {isModalOpen && selectedUser && (
          <UserManagementModal
            user={selectedUser}
            onClose={handleCloseModal}
            onUserUpdated={handleUserUpdated}
          />
        )}
      </div>
    </div>
  );
}

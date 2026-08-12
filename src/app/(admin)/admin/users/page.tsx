"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchUsers, updateUser, softDeleteUser, User } from "@/app/lib/api-client";
import LoadingSkeleton from "@/app/components/loading-skeleton";
import styles from "./users.module.css";

export default function UserManagementPage() {
  const router = useRouter();
  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editStatus, setEditStatus] = useState("");

  function startEdit(user: User) {
    setEditingId(user.id);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditStatus(user.status);
  }

  async function saveEdit(userId: string) {
    if (!editingId) return;
    try {
      await updateUser(userId, { name: editName, email: editEmail, status: editStatus });
      setEditingId(null);
      refetch();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update user");
    }
  }

  async function cancelEdit() {
    setEditingId(null);
  }

  async function handleDelete(userId: string) {
    if (!confirm("Soft-delete this user? They will be deactivated.")) return;
    try {
      await softDeleteUser(userId);
      refetch();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete user");
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>User Management</h1>
          <button type="button" onClick={() => router.push("/admin/dashboard")} className={styles.btnBack}>Back to Dashboard</button>
        </header>

        {isLoading && <LoadingSkeleton lines={5} />}

        {error && <div className={styles.error}>{typeof error === 'string' ? error : String(error)}</div>}

        {!isLoading && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Created</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user.id}>
                  {editingId === user.id ? (
                    <>
                      <td><input className={styles.input} value={editName} onChange={(e) => setEditName(e.target.value)} /></td>
                      <td><input className={styles.input} value={editEmail} onChange={(e) => setEditEmail(e.target.value)} /></td>
                      <td>
                        <select className={styles.select} value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="pending">Pending</option>
                        </select>
                      </td>
                      <td colSpan={3}>
                        <button type="button" onClick={() => saveEdit(user.id)} className={styles.btnSave}>Save</button>
                        <button type="button" onClick={cancelEdit} className={styles.btnCancel}>Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className={styles.cellName}>{user.name}</td>
                      <td>{user.email}</td>
                      <td><span className={`${styles.statusBadge} ${user.status === "active" ? styles.statusActive : user.status === "inactive" ? styles.statusInactive : styles.statusPending}`}>{user.status}</span></td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : "—"}</td>
                      <td>
                        <button type="button" onClick={() => startEdit(user)} className={styles.btnEdit}>Edit</button>
                        <button type="button" onClick={() => handleDelete(user.id)} className={styles.btnDelete}>Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!isLoading && (!users || users.length === 0) && (
          <div className={styles.empty}>No users found.</div>
        )}
      </div>
    </div>
  );
}

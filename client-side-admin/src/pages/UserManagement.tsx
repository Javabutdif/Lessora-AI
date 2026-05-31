import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUsers, softDeleteUser, User } from "../services/api";
import UserManagementModal from "../components/UserManagementModal";
import { Button, Table, Toast, ConfirmationModal, Badge } from "../components/ui";
import { TableColumn, TableAction } from "../types/components";
import styles from "./UserManagement.module.css";

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{
    variant: "success" | "error" | "warning" | "info";
    message: string;
  } | null>(null);
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

  function handleDeleteClick(userId: string) {
    setDeleteUserId(userId);
  }

  async function handleDeleteConfirm() {
    if (!deleteUserId) return;

    try {
      setIsDeleting(true);
      await softDeleteUser(deleteUserId);
      setUsers(users.filter((u) => u.id !== deleteUserId));
      setDeleteUserId(null);
      setToast({ variant: "success", message: "User deleted successfully" });
    } catch (err) {
      setToast({
        variant: "error",
        message: err instanceof Error ? err.message : "Failed to delete user",
      });
    } finally {
      setIsDeleting(false);
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
    setToast({ variant: "success", message: "User updated successfully" });
  }

  const getStatusVariant = (
    status: string
  ): "success" | "warning" | "error" | "info" | "neutral" => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "error";
      case "pending":
        return "warning";
      default:
        return "neutral";
    }
  };

  // Define table columns
  const columns: TableColumn[] = [
    {
      key: "name",
      label: "Name",
      width: "20%",
    },
    {
      key: "email",
      label: "Email",
      width: "25%",
    },
    {
      key: "status",
      label: "Status",
      width: "15%",
      render: (value: string) => (
        <Badge variant={getStatusVariant(value)} size="sm">
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      width: "20%",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  // Define table actions
  const actions: TableAction[] = [
    {
      label: "Edit",
      onClick: (row: User) => handleEdit(row),
      variant: "primary",
    },
    {
      label: "Delete",
      onClick: (row: User) => handleDeleteClick(row.id),
      variant: "danger",
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <p className={styles.headerLabel}>User Management</p>
            <h1 className={styles.headerTitle}>Manage users</h1>
            <p className={styles.headerDescription}>
              View, edit, and manage platform users.
            </p>
          </div>

          <Button
            variant="secondary"
            size="medium"
            onClick={() => navigate("/admin/dashboard")}
          >
            Back to Dashboard
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className={styles.errorBanner} role="alert">
            {error}
          </div>
        )}

        {/* Users Table */}
        <div className={styles.tableContainer}>
          <Table
            columns={columns}
            data={users}
            actions={actions}
            loading={loading}
            emptyMessage="No users found."
          />
        </div>

        {/* User Management Modal */}
        {isModalOpen && selectedUser && (
          <UserManagementModal
            user={selectedUser}
            onClose={handleCloseModal}
            onUserUpdated={handleUserUpdated}
          />
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={deleteUserId !== null}
          onClose={() => setDeleteUserId(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete User"
          message="Are you sure you want to delete this user? This action cannot be undone."
          confirmText="Delete User"
          cancelText="Cancel"
          variant="danger"
          loading={isDeleting}
        />

        {/* Toast Notifications */}
        {toast && (
          <div className={styles.toastContainer}>
            <Toast
              variant={toast.variant}
              message={toast.message}
              onClose={() => setToast(null)}
              duration={4000}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Made with Bob

import { useState } from "react";
import { updateUser, User } from "../services/api";
import { Modal, Input, Select, Button } from "./ui";
import styles from "./UserManagementModal.module.css";

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
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
  }>({});

  function validateForm(): boolean {
    const errors: { name?: string; email?: string } = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

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

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "pending", label: "Pending" },
  ];

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Edit User"
      description="Update user information"
      size="md"
      closeOnBackdropClick={!loading}
      closeOnEscape={!loading}
    >
      <div className={styles.modalContent}>
        {/* Error Message */}
        {error && (
          <div className={styles.errorBanner} role="alert">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Name Field */}
          <Input
            type="text"
            label="Name"
            name="name"
            value={formData.name}
            onChange={(value) => {
              setFormData({ ...formData, name: value });
              setFieldErrors({ ...fieldErrors, name: undefined });
            }}
            error={fieldErrors.name}
            required
            disabled={loading}
            fullWidth
            autoComplete="name"
          />

          {/* Email Field */}
          <Input
            type="email"
            label="Email"
            name="email"
            value={formData.email}
            onChange={(value) => {
              setFormData({ ...formData, email: value });
              setFieldErrors({ ...fieldErrors, email: undefined });
            }}
            error={fieldErrors.email}
            required
            disabled={loading}
            fullWidth
            autoComplete="email"
          />

          {/* Status Field */}
          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={(value) =>
              setFormData({
                ...formData,
                status: value as User["status"],
              })
            }
            options={statusOptions}
            required
            disabled={loading}
            fullWidth
          />

          {/* Action Buttons */}
          <div className={styles.actions}>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={loading}
              fullWidth
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

// Made with Bob

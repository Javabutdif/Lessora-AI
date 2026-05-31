import React from 'react';
import { ConfirmationModalProps } from '../../types/components';
import { Modal } from './Modal';
import { Button } from './Button';
import styles from './ConfirmationModal.module.css';

/**
 * ConfirmationModal Component
 * Confirmation dialog for destructive or important actions
 * Extends the base Modal component
 * Reference: Admin Dashboard Redesign Specification
 */
export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}) => {
  const handleConfirm = () => {
    if (!loading) {
      onConfirm();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !loading) {
      event.preventDefault();
      handleConfirm();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      closeOnBackdropClick={!loading}
      closeOnEscape={!loading}
    >
      <div className={styles.content} onKeyDown={handleKeyDown}>
        <div className={`${styles.iconWrapper} ${styles[variant]}`}>
          {variant === 'danger' && (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" />
              <path
                d="M24 14v12m0 6h.02"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {variant === 'warning' && (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path
                d="M24 14v12m0 6h.02M20.667 8.5l-15 26A3.333 3.333 0 008.5 40h31a3.333 3.333 0 002.833-5l-15-26a3.333 3.333 0 00-5.666 0z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {variant === 'info' && (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" />
              <path
                d="M24 32V24m0-8h.02"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>

        <p className={styles.message}>{message}</p>

        <div className={styles.actions}>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            fullWidth
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={handleConfirm}
            loading={loading}
            disabled={loading}
            fullWidth
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Made with Bob

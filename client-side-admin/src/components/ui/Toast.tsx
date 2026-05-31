import React, { useEffect } from 'react';
import { ToastProps } from '../../types/components';
import styles from './Toast.module.css';

/**
 * Toast Component
 * Notification toast with auto-dismiss and variants
 * Reference: Admin Dashboard Redesign Specification
 */
export const Toast: React.FC<ToastProps> = ({
  variant,
  message,
  duration = 4000,
  onClose,
  id,
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const toastClasses = [styles.toast, styles[variant]].filter(Boolean).join(' ');

  const getIcon = () => {
    switch (variant) {
      case 'success':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M16.667 5L7.5 14.167 3.333 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case 'error':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M15 5L5 15M5 5L15 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case 'warning':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 6v4m0 4h.01M8.667 2.5l-7.5 13A1.667 1.667 0 002.5 18h15a1.667 1.667 0 001.333-2.5l-7.5-13a1.667 1.667 0 00-2.666 0z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case 'info':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 18.333a8.333 8.333 0 100-16.666 8.333 8.333 0 000 16.666zM10 13.333V10m0-3.333h.008"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={toastClasses} role="alert" aria-live="polite">
      <div className={styles.iconWrapper}>{getIcon()}</div>
      <p className={styles.message}>{message}</p>
      <button
        type="button"
        className={styles.closeButton}
        onClick={onClose}
        aria-label="Close notification"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M12 4L4 12M4 4l8 8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

// Made with Bob

import React from 'react';
import { BadgeProps } from '../../types/components';
import styles from './Badge.module.css';

/**
 * Badge Component
 * Status indicator with multiple variants and sizes
 * Reference: Admin Dashboard Redesign Specification
 */
export const Badge: React.FC<BadgeProps> = ({
  variant,
  size = 'md',
  children,
  className = '',
}) => {
  const badgeClasses = [
    styles.badge,
    styles[variant],
    styles[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={badgeClasses} role="status">
      {children}
    </span>
  );
};

// Made with Bob

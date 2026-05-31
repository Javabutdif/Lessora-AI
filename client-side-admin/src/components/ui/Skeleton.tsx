import React from 'react';
import { SkeletonProps } from '../../types/components';
import styles from './Skeleton.module.css';

/**
 * Skeleton Component
 * Loading placeholder with shimmer animation
 * Reference: Admin Dashboard Redesign Specification
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  variant,
  count = 1,
  height,
  width,
  className = '',
}) => {
  const skeletonClasses = [
    styles.skeleton,
    styles[variant],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const skeletonStyle: React.CSSProperties = {
    ...(height && { height }),
    ...(width && { width }),
  };

  // Render multiple skeletons if count > 1
  if (count > 1) {
    return (
      <div className={styles.skeletonGroup}>
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={skeletonClasses}
            style={skeletonStyle}
            aria-busy="true"
            aria-live="polite"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={skeletonClasses}
      style={skeletonStyle}
      aria-busy="true"
      aria-live="polite"
    />
  );
};

// Made with Bob

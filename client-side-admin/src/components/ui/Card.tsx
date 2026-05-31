import React from 'react';
import { CardProps } from '../../types/components';
import styles from './Card.module.css';

/**
 * Card Component
 * Glass-morphism card with optional accent colors and hover effects
 * Reference: Admin Dashboard Redesign Specification
 */
export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  accentColor,
  hoverable = false,
  onClick,
  children,
  className = '',
}) => {
  const cardClasses = [
    styles.card,
    styles[variant],
    styles[`padding-${padding}`],
    hoverable && styles.hoverable,
    onClick && styles.clickable,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const cardStyle: React.CSSProperties = accentColor
    ? { borderLeftColor: accentColor }
    : {};

  return (
    <div
      className={cardClasses}
      style={cardStyle}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {children}
    </div>
  );
};

// Made with Bob

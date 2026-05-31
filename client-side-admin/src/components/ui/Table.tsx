import React from 'react';
import { TableProps } from '../../types/components';
import { Button } from './Button';
import { Skeleton } from './Skeleton';
import styles from './Table.module.css';

/**
 * Table Component
 * Responsive table that transforms to cards on mobile/tablet
 * Reference: Admin Dashboard Redesign Specification
 */
export const Table: React.FC<TableProps> = ({
  columns,
  data,
  onRowClick,
  actions,
  loading = false,
  emptyMessage = 'No data available',
  className = '',
}) => {
  // Loading state
  if (loading) {
    return (
      <div className={`${styles.tableWrapper} ${className}`}>
        <Skeleton variant="table" count={5} />
      </div>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className={`${styles.emptyState} ${className}`}>
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="8"
            y="16"
            width="48"
            height="40"
            rx="4"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M8 24h48M20 16v-4M44 16v-4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <p className={styles.emptyMessage}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`${styles.tableWrapper} ${className}`}>
      {/* Desktop Table View */}
      <div className={styles.desktopTable}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={styles.th}
                  style={{ width: column.width }}
                >
                  {column.label}
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th className={styles.th}>Actions</th>
              )}
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`${styles.tr} ${onRowClick ? styles.clickable : ''}`}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((column) => (
                  <td key={column.key} className={styles.td}>
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </td>
                ))}
                {actions && actions.length > 0 && (
                  <td className={styles.td}>
                    <div className={styles.actions}>
                      {actions.map((action, actionIndex) => (
                        <Button
                          key={actionIndex}
                          variant={action.variant}
                          size="small"
                          onClick={() => action.onClick(row)}
                          icon={action.icon}
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Card View */}
      <div className={styles.cardList}>
        {data.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`${styles.card} ${onRowClick ? styles.clickable : ''}`}
            onClick={() => onRowClick && onRowClick(row)}
          >
            {columns.map((column) => (
              <div key={column.key} className={styles.cardRow}>
                <span className={styles.cardLabel}>{column.label}:</span>
                <span className={styles.cardValue}>
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key]}
                </span>
              </div>
            ))}
            {actions && actions.length > 0 && (
              <div className={styles.cardActions}>
                {actions.map((action, actionIndex) => (
                  <Button
                    key={actionIndex}
                    variant={action.variant}
                    size="small"
                    fullWidth
                    onClick={() => action.onClick(row)}
                    icon={action.icon}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Made with Bob

/**
 * UI Components Library
 * Centralized exports for all reusable UI components
 * Reference: Admin Dashboard Redesign Specification - Phase 2
 */

export { Button } from './Button';
export { Badge } from './Badge';
export { Card } from './Card';
export { Input, Select, Textarea } from './Input';
export { Skeleton } from './Skeleton';
export { Modal } from './Modal';
export { Toast } from './Toast';
export { ConfirmationModal } from './ConfirmationModal';
export { Table } from './Table';

// Re-export types for convenience
export type {
  ButtonProps,
  ButtonVariant,
  ButtonSize,
  BadgeProps,
  BadgeVariant,
  BadgeSize,
  CardProps,
  CardVariant,
  CardPadding,
  InputProps,
  SelectProps,
  TextareaProps,
  InputType,
  ModalProps,
  ModalSize,
  ToastProps,
  ToastVariant,
  ConfirmationModalProps,
  ConfirmationVariant,
  TableProps,
  TableColumn,
  TableAction,
  SkeletonProps,
  SkeletonVariant,
} from '../../types/components';

// Made with Bob

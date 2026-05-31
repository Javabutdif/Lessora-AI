/**
 * Shared TypeScript type definitions for UI components
 * Reference: Admin Dashboard Redesign Specification
 */

// ========================================
// BUTTON COMPONENT TYPES
// ========================================

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  ariaLabel?: string;
}

// ========================================
// BADGE COMPONENT TYPES
// ========================================

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  variant: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  className?: string;
}

// ========================================
// CARD COMPONENT TYPES
// ========================================

export type CardVariant = 'default' | 'highlighted' | 'interactive';
export type CardPadding = 'sm' | 'md' | 'lg';

export interface CardProps {
  variant?: CardVariant;
  padding?: CardPadding;
  accentColor?: string;
  hoverable?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

// ========================================
// INPUT COMPONENT TYPES
// ========================================

export type InputType = 'text' | 'email' | 'password' | 'number';

export interface InputProps {
  type?: InputType;
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  id?: string;
  name?: string;
  autoComplete?: string;
}

export interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

export interface TextareaProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  rows?: number;
  className?: string;
  id?: string;
  name?: string;
}

// ========================================
// MODAL COMPONENT TYPES
// ========================================

export type ModalSize = 'sm' | 'md' | 'lg';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  size?: ModalSize;
  children: React.ReactNode;
  className?: string;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
}

// ========================================
// CONFIRMATION MODAL TYPES
// ========================================

export type ConfirmationVariant = 'danger' | 'warning' | 'info';

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmationVariant;
  loading?: boolean;
}

// ========================================
// TABLE COMPONENT TYPES
// ========================================

export interface TableColumn {
  key: string;
  label: string;
  width?: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface TableAction {
  label: string;
  onClick: (row: any) => void;
  variant: 'primary' | 'danger';
  icon?: React.ReactNode;
}

export interface TableProps {
  columns: TableColumn[];
  data: Array<Record<string, any>>;
  onRowClick?: (row: any) => void;
  actions?: TableAction[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

// ========================================
// SKELETON COMPONENT TYPES
// ========================================

export type SkeletonVariant = 'text' | 'card' | 'metric' | 'table';

export interface SkeletonProps {
  variant: SkeletonVariant;
  count?: number;
  height?: string;
  width?: string;
  className?: string;
}

// ========================================
// TOAST COMPONENT TYPES
// ========================================

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  variant: ToastVariant;
  message: string;
  duration?: number;
  onClose: () => void;
  id?: string;
}

export interface ToastContextValue {
  showToast: (variant: ToastVariant, message: string, duration?: number) => void;
  hideToast: (id: string) => void;
}

// ========================================
// STATUS TYPES
// ========================================

export type StatusType = 'active' | 'inactive' | 'pending';

export interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

// ========================================
// LOADING TYPES
// ========================================

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

// ========================================
// PAGINATION TYPES
// ========================================

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

// ========================================
// FORM TYPES
// ========================================

export interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

// ========================================
// LAYOUT TYPES
// ========================================

export interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

// ========================================
// METRIC CARD TYPES
// ========================================

export interface MetricCardProps {
  label: string;
  value: string | number;
  description?: string;
  accentColor?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  className?: string;
}

// ========================================
// USER TYPES (for User Management)
// ========================================

export interface User {
  _id: string;
  name: string;
  email: string;
  status: StatusType;
  createdAt: string;
  updatedAt?: string;
}

export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  status: StatusType;
}

// ========================================
// COMMON PROPS
// ========================================

export interface BaseComponentProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export interface ClickableComponentProps extends BaseComponentProps {
  onClick?: () => void;
  disabled?: boolean;
}

// ========================================
// UTILITY TYPES
// ========================================

export type Spacing = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type Color = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Made with Bob

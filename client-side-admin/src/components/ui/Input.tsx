import React from 'react';
import { InputProps, SelectProps, TextareaProps } from '../../types/components';
import styles from './Input.module.css';

/**
 * Input Component
 * Text input with label, error states, and validation
 * Reference: Admin Dashboard Redesign Specification
 */
export const Input: React.FC<InputProps> = ({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  fullWidth = false,
  className = '',
  id,
  name,
  autoComplete,
}) => {
  const inputId = id || `input-${name || Math.random().toString(36).substr(2, 9)}`;

  const inputClasses = [
    styles.input,
    error && styles.error,
    fullWidth && styles.fullWidth,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`${styles.inputWrapper} ${fullWidth ? styles.fullWidth : ''}`}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        name={name}
        className={inputClasses}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
      />
      {error && (
        <span id={`${inputId}-error`} className={styles.errorMessage} role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

/**
 * Select Component
 * Dropdown select with label and error states
 */
export const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  error,
  required = false,
  disabled = false,
  fullWidth = false,
  className = '',
  id,
  name,
}) => {
  const selectId = id || `select-${name || Math.random().toString(36).substr(2, 9)}`;

  const selectClasses = [
    styles.select,
    error && styles.error,
    fullWidth && styles.fullWidth,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`${styles.inputWrapper} ${fullWidth ? styles.fullWidth : ''}`}>
      {label && (
        <label htmlFor={selectId} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <select
        id={selectId}
        name={name}
        className={selectClasses}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${selectId}-error` : undefined}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <span id={`${selectId}-error`} className={styles.errorMessage} role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

/**
 * Textarea Component
 * Multi-line text input with label and error states
 */
export const Textarea: React.FC<TextareaProps> = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  fullWidth = false,
  rows = 4,
  className = '',
  id,
  name,
}) => {
  const textareaId = id || `textarea-${name || Math.random().toString(36).substr(2, 9)}`;

  const textareaClasses = [
    styles.textarea,
    error && styles.error,
    fullWidth && styles.fullWidth,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`${styles.inputWrapper} ${fullWidth ? styles.fullWidth : ''}`}>
      {label && (
        <label htmlFor={textareaId} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        name={name}
        className={textareaClasses}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
        rows={rows}
        aria-invalid={!!error}
        aria-describedby={error ? `${textareaId}-error` : undefined}
      />
      {error && (
        <span id={`${textareaId}-error`} className={styles.errorMessage} role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

// Made with Bob

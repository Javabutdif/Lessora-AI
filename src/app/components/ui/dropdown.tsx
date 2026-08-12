import { useState, useRef, useEffect } from "react";
import styles from "./dropdown.module.css";

interface DropdownOption { value: string; label: string; }

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
}

export default function Dropdown({ options, value, onChange, placeholder = "Select...", disabled = false, className = "", fullWidth = false }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`${styles.dropdown} ${fullWidth ? styles.fullWidth : ""} ${className}`}>
      <button type="button" className={styles.trigger} onClick={() => !disabled && setOpen((v) => !v)} disabled={disabled} aria-haspopup="listbox" aria-expanded={open}>
        <span className={styles.triggerLabel}>{selected ? selected.label : placeholder}</span>
        <svg className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`} width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 4l4 4 4-4" /></svg>
      </button>
      {open && (
        <ul className={styles.panel} role="listbox">
          {options.map((option) => (
            <li key={option.value} role="option" aria-selected={option.value === value} className={`${styles.option} ${option.value === value ? styles.optionSelected : ""}`} onClick={() => { onChange(option.value); setOpen(false); }}>
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

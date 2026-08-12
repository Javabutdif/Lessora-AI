"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./scroll-reveal.module.css";

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  threshold?: number;
  className?: string;
}

export default function ScrollReveal({ children, delay = 0, threshold = 0.1, className = "" }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.unobserve(el);
      }
    }, { threshold });
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div ref={ref} className={`${styles.reveal} ${visible ? styles.revealed : ""} ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

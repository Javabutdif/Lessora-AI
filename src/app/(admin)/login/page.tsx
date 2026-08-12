"use client";
import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/app/lib/api-client";
import { setSeoMetadata } from "@/app/utils/seo";
import styles from "@/portal-theme.module.css";

export default function LoginPage() {
  useEffect(() => {
    setSeoMetadata({ title: "Admin Login | Lessora AI", description: "Admin login for Lessora AI.", robots: "noindex, follow" });
  }, []);

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await loginAdmin(email, password);
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.adminAuthPage}>
      <div className={styles.adminAuthCard}>
        <div style={{ marginBottom: 20 }}>
          <p className={styles.adminAuthEyebrow}>Admin Portal</p>
          <h1 className={styles.adminAuthTitle}>Sign in</h1>
          <p className={styles.adminAuthSubtitle}>Use administrator credentials to open the administrator dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.adminAuthForm}>
          <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="admin@example.com" className={styles.adminAuthInput} />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className={styles.adminAuthInput} />
          </label>

          {error && <p className={styles.adminAuthError}>{error}</p>}

          <button type="submit" disabled={isLoading} className={styles.adminAuthSubmit}>
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

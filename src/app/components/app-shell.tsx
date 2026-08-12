"use client";

import { usePathname } from "next/navigation";
import PageProgressBar from "./page-progress";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/home" || pathname === "/";
  const isInfoPage = pathname === "/about" || pathname === "/privacy-policy" || pathname === "/terms-and-conditions";
  const showProgress = !isHomePage && !isInfoPage;

  return (
    <>
      {showProgress && <PageProgressBar />}
      {children}
    </>
  );
}

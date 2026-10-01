import type { Metadata } from "next";

// Generate and refine are app screens, not search landing pages.
// The preview layout overrides this for public lesson plans.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
};

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return children;
}

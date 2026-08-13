import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lesson Plans Made Simply",
  description:
    "Lessora AI helps educators create structured lesson plans, objectives, activities, and assessments — no account required.",
  alternates: {
    canonical: "/home",
  },
};

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return children;
}

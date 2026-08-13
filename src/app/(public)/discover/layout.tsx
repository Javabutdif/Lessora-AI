import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discover Lesson Plans",
  description:
    "Browse lesson plans shared by teachers across the platform. Search by topic, subject, or grade level.",
  alternates: {
    canonical: "/discover",
  },
};

export default function DiscoverLayout({ children }: { children: React.ReactNode }) {
  return children;
}

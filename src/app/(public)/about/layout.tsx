import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Lessora AI",
  description:
    "Lessora AI is an AI-powered educational platform that helps teachers create organized, professional, and curriculum-ready lesson plans in minutes.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}

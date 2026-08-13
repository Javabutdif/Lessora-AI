import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support Lessora AI",
  description:
    "Support Lessora AI with a one-time donation through Paymongo-hosted checkout.",
  alternates: {
    canonical: "/support",
  },
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return children;
}

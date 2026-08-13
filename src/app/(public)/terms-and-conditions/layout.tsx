import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "The terms and conditions that govern your use of Lessora AI.",
  alternates: {
    canonical: "/terms-and-conditions",
  },
};

export default function TermsAndConditionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

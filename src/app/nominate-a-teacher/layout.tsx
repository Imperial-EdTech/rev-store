import type { Metadata } from "next";
import type { ReactNode } from "react";

const description =
  "Nominate the teacher who changed your story. Imperial Edtech and Revrica are celebrating Nigeria's most impactful teachers, and one of them wins a brand-new Rev laptop.";

export const metadata: Metadata = {
  title: "My Teacher, My Hero: Nominate a Teacher",
  description,
  alternates: { canonical: "/nominate-a-teacher" },
  openGraph: { title: "My Teacher, My Hero", description, url: "/nominate-a-teacher" },
  twitter: { title: "My Teacher, My Hero", description },
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}

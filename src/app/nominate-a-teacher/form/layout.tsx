import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Nominate a Teacher: My Teacher, My Hero",
  alternates: { canonical: "/nominate-a-teacher/form" },
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}

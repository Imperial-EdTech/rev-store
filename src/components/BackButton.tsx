"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import { hasPreviousPageInApp } from "@/lib/navigation";

/**
 * "Back": returns to the page the visitor came from on this site. If they
 * arrived here directly (a link from elsewhere, a new tab), it goes to
 * `fallback` rather than leaving the site.
 */
export function BackButton({ fallback = "/", className, style }: { fallback?: string; className?: string; style?: CSSProperties }) {
  const router = useRouter();
  function goBack() {
    if (hasPreviousPageInApp()) router.back();
    else router.push(fallback);
  }
  return (
    <button className={className} onClick={goBack} style={style} type="button">
      <ArrowLeft aria-hidden size={16} /> Back
    </button>
  );
}

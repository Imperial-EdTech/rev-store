"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Whether the visitor has moved between pages of this site in this tab.
 * Browser history can't tell us that (it includes other sites and the new-tab
 * page), so the app counts its own route changes.
 */
let pagesVisited = 0;

export function hasPreviousPageInApp(): boolean {
  return pagesVisited > 1;
}

/** Counts route changes. Rendered once, in the app providers. */
export function NavigationTracker() {
  const pathname = usePathname();
  useEffect(() => {
    pagesVisited += 1;
  }, [pathname]);
  return null;
}

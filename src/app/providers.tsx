"use client";

import type { ReactNode } from "react";
import { CartProvider } from "@/lib/cart/cart-context";

/** Client-side providers for the whole app. The root layout stays a Server Component. */
export function Providers({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}

"use client";

import type { ReactNode } from "react";
import { CheckoutBar } from "@/components/cart/CheckoutBar";
import { CartProvider } from "@/lib/cart/cart-context";
import { NavigationTracker } from "@/lib/navigation";

/** Client-side providers for the whole app. The root layout stays a Server Component. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <NavigationTracker />
      {children}
      <CheckoutBar />
    </CartProvider>
  );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart/cart-context";
import { formatNaira } from "@/lib/catalog";
import styles from "./CheckoutBar.module.css";

/** Pages where people browse and add to cart. The bar stays off forms, checkout and admin. */
function isShoppingPage(pathname: string): boolean {
  return pathname === "/" || pathname === "/products" || pathname.startsWith("/products/");
}

/**
 * Floating "Checkout" button, shown on shopping pages whenever the cart has
 * something in it. It opens the cart, where the order is reviewed before
 * continuing to checkout.
 */
export function CheckoutBar() {
  const { count, subtotal, hydrated } = useCart();
  const pathname = usePathname();
  const visible = hydrated && count > 0 && isShoppingPage(pathname);

  return (
    <>
      {/* Room at the end of the page, so the bar never hides the footer's last lines. */}
      {visible && <div aria-hidden className={styles.spacer} />}
      <AnimatePresence>
        {visible && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className={styles.wrap}
            exit={{ opacity: 0, y: 16 }}
            initial={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link aria-label={`Checkout: ${count} item${count === 1 ? "" : "s"}, ${formatNaira(subtotal)}`} className={styles.bar} href="/cart">
              <span className={styles.icon}>
                <ShoppingCart aria-hidden size={18} />
                <span className={styles.count}>{count > 9 ? "9+" : count}</span>
              </span>
              <span className={styles.label}>Checkout</span>
              <span className={styles.total}>{formatNaira(subtotal)}</span>
              <ArrowRight aria-hidden className={styles.arrow} size={18} />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

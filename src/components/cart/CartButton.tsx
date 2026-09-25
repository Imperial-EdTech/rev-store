"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/lib/cart/cart-context";
import styles from "./CartButton.module.css";

/** Header cart icon with a live item count. Links to /cart. */
export function CartButton() {
  const { count, hydrated } = useCart();
  const showBadge = hydrated && count > 0;
  const label = showBadge ? `Cart, ${count} item${count === 1 ? "" : "s"}` : "Cart";

  return (
    <Link aria-label={label} className={styles.button} href="/cart">
      <ShoppingCart aria-hidden size={20} strokeWidth={2} />
      <AnimatePresence initial={false}>
        {showBadge && (
          <motion.span
            // Re-keying on count replays the pop each time an item is added.
            key={count}
            animate={{ scale: 1 }}
            aria-hidden
            className={styles.badge}
            exit={{ scale: 0 }}
            initial={{ scale: 0.4 }}
            transition={{ type: "spring", stiffness: 520, damping: 22 }}
          >
            {count > 9 ? "9+" : count}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}

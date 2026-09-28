"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { getProduct, isPurchasable, type Product } from "@/lib/catalog";
import { MAX_QTY_PER_LINE } from "./limits";

/**
 * Cart state.
 *
 * Design notes:
 * - Only { productId, qty } is stored. Price, name and image always come from
 *   the catalogue, so a saved cart can never show an outdated price.
 * - Saved to localStorage under a versioned key. If the shape ever changes,
 *   bump the version; old data is ignored instead of breaking the page.
 * - `hydrated` stays false until localStorage has been read, so the server
 *   render and the first client render match. Consumers use it to avoid
 *   showing an empty cart before the saved one has loaded.
 * - Changes made in other tabs are picked up through the `storage` event.
 */

const STORAGE_KEY = "revstore_cart_v1";
export { MAX_QTY_PER_LINE };

type CartLine = { productId: string; qty: number };

type State = { lines: CartLine[]; hydrated: boolean };

type Action =
  | { type: "hydrate"; lines: CartLine[] }
  | { type: "add"; productId: string; qty: number }
  | { type: "setQty"; productId: string; qty: number }
  | { type: "remove"; productId: string }
  | { type: "clear" };

const clampQty = (n: number) => Math.max(1, Math.min(MAX_QTY_PER_LINE, Math.floor(n)));

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return { lines: action.lines, hydrated: true };
    case "add": {
      const existing = state.lines.find((l) => l.productId === action.productId);
      const lines = existing
        ? state.lines.map((l) =>
            l.productId === action.productId ? { ...l, qty: clampQty(l.qty + action.qty) } : l,
          )
        : [...state.lines, { productId: action.productId, qty: clampQty(action.qty) }];
      return { ...state, lines };
    }
    case "setQty":
      return {
        ...state,
        lines: state.lines.map((l) =>
          l.productId === action.productId ? { ...l, qty: clampQty(action.qty) } : l,
        ),
      };
    case "remove":
      return { ...state, lines: state.lines.filter((l) => l.productId !== action.productId) };
    case "clear":
      return { ...state, lines: [] };
  }
}

/** Parse saved data, discarding anything malformed or no longer purchasable. */
function readStorage(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (l): l is CartLine =>
          typeof l?.productId === "string" && typeof l?.qty === "number" && l.qty > 0,
      )
      .filter((l) => {
        const p = getProduct(l.productId);
        return p !== undefined && isPurchasable(p);
      })
      .map((l) => ({ productId: l.productId, qty: clampQty(l.qty) }));
  } catch {
    return [];
  }
}

export type CartItem = { product: Product & { price: number }; qty: number; lineTotal: number };

type CartContextValue = {
  items: CartItem[];
  /** Total number of units (drives the header badge). */
  count: number;
  subtotal: number;
  hydrated: boolean;
  add: (productId: string, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  qtyOf: (productId: string) => number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [], hydrated: false });

  // Load once on mount, then keep in sync with other tabs.
  useEffect(() => {
    dispatch({ type: "hydrate", lines: readStorage() });
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) dispatch({ type: "hydrate", lines: readStorage() });
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Save after every change, but never before the initial load
  // (otherwise the empty initial state would overwrite the saved cart).
  useEffect(() => {
    if (!state.hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
    } catch {
      /* Storage full or disabled (e.g. private mode): the cart still works for this session. */
    }
  }, [state.lines, state.hydrated]);

  const add = useCallback((productId: string, qty = 1) => {
    const p = getProduct(productId);
    if (!p || !isPurchasable(p)) return; // On-request and out-of-stock items can't be added.
    dispatch({ type: "add", productId, qty });
  }, []);
  const setQty = useCallback(
    (productId: string, qty: number) => dispatch({ type: "setQty", productId, qty }),
    [],
  );
  const remove = useCallback((productId: string) => dispatch({ type: "remove", productId }), []);
  const clear = useCallback(() => dispatch({ type: "clear" }), []);

  const value = useMemo<CartContextValue>(() => {
    const items: CartItem[] = [];
    for (const line of state.lines) {
      const product = getProduct(line.productId);
      if (!product || !isPurchasable(product)) continue;
      items.push({ product, qty: line.qty, lineTotal: product.price * line.qty });
    }
    return {
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal: items.reduce((n, i) => n + i.lineTotal, 0),
      hydrated: state.hydrated,
      add,
      setQty,
      remove,
      clear,
      qtyOf: (id) => state.lines.find((l) => l.productId === id)?.qty ?? 0,
    };
  }, [state, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider> (see src/app/providers.tsx).");
  return ctx;
}

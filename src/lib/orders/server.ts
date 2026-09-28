import "server-only";
import { displayName, getProduct, isPurchasable } from "@/lib/catalog";
import { dbFailure, getDb, notConfigured, type Result } from "@/lib/db";
import type { OrderStatus } from "@/lib/statuses";
import type { Order, OrderLine, OrderRequest } from "./schema";

/**
 * Orders: server-side only.
 *
 * Prices are always calculated here from the catalogue. The browser only says
 * which products and how many; it never decides what anything costs.
 * Writes go through the place_web_order database function (one transaction:
 * contact, order and items together).
 */

/** Prices the requested items from the catalogue. Rejects anything that can't be bought. */
export function priceItems(items: OrderRequest["items"]): Result<{ lines: OrderLine[]; total: number }> {
  const merged = new Map<string, number>();
  for (const { productId, qty } of items) merged.set(productId, (merged.get(productId) ?? 0) + qty);

  const lines: OrderLine[] = [];
  for (const [productId, qty] of merged) {
    const product = getProduct(productId);
    if (!product || !isPurchasable(product)) {
      return {
        ok: false,
        status: 409,
        error: "An item in your cart is no longer available to buy online. Please review your cart.",
      };
    }
    lines.push({ productId, name: displayName(product), qty, unitPrice: product.price, lineTotal: product.price * qty });
  }
  return { ok: true, value: { lines, total: lines.reduce((sum, l) => sum + l.lineTotal, 0) } };
}

/** Saves the checkout (or updates it, if this checkout session already created an unpaid order). */
export async function saveOrder(request: OrderRequest): Promise<Result<{ ref: string; lines: OrderLine[]; total: number }>> {
  const db = getDb();
  if (!db) return notConfigured;

  const priced = priceItems(request.items);
  if (!priced.ok) return priced;

  const { buyer } = request;
  const { data, error } = await db.rpc("place_web_order", {
    p: {
      client_key: request.clientKey,
      buyer: {
        name: buyer.name,
        email: buyer.email,
        phone: buyer.phone,
        fulfillment: buyer.fulfillment,
        address: buyer.fulfillment === "delivery" ? buyer.address : null,
      },
      lines: priced.value.lines.map((l) => ({
        product_id: l.productId,
        product_name: l.name,
        unit_price: l.unitPrice,
        quantity: l.qty,
      })),
    },
  });
  if (error) return dbFailure("orders: save", error, "Could not save your order. Please try again.");

  return { ok: true, value: { ref: data.ref as string, lines: priced.value.lines, total: priced.value.total } };
}

// ─── Admin ────────────────────────────────────────────────────

const ORDER_SELECT = `
  id, ref, status, channel, customer_name, customer_email, customer_phone, fulfillment, delivery_address,
  total, placed_at, updated_at, status_changed_at, status_changed_by,
  order_items ( product_id, product_name, unit_price, quantity, line_total )
`;

type OrderRow = {
  id: string;
  ref: string;
  status: OrderStatus;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  fulfillment: "pickup" | "delivery";
  delivery_address: string | null;
  total: number | string;
  placed_at: string;
  updated_at: string;
  status_changed_at: string;
  order_items: { product_id: string; product_name: string; unit_price: number | string; quantity: number; line_total: number | string }[];
};

function toOrder(row: OrderRow): Order {
  return {
    id: row.id,
    ref: row.ref,
    status: row.status,
    customerName: row.customer_name,
    customerEmail: row.customer_email ?? "",
    customerPhone: row.customer_phone,
    fulfillment: row.fulfillment,
    deliveryAddress: row.delivery_address,
    items: row.order_items.map((i) => ({
      productId: i.product_id,
      name: i.product_name,
      qty: i.quantity,
      unitPrice: Number(i.unit_price),
      lineTotal: Number(i.line_total),
    })),
    total: Number(row.total),
    createdAt: row.placed_at,
    updatedAt: row.updated_at,
    statusChangedAt: row.status_changed_at,
  };
}

export async function listOrders(): Promise<Result<Order[]>> {
  const db = getDb();
  if (!db) return notConfigured;
  const { data, error } = await db.from("orders").select(ORDER_SELECT).order("placed_at", { ascending: false }).limit(1000);
  if (error) return dbFailure("orders: list", error, "Could not load orders.");
  return { ok: true, value: (data as unknown as OrderRow[]).map(toOrder) };
}

export async function getOrder(id: string): Promise<Result<Order>> {
  const db = getDb();
  if (!db) return notConfigured;
  const { data, error } = await db.from("orders").select(ORDER_SELECT).eq("id", id).maybeSingle();
  if (error) return dbFailure("orders: get", error, "Could not load the order.");
  if (!data) return { ok: false, status: 404, error: "Order not found." };
  return { ok: true, value: toOrder(data as unknown as OrderRow) };
}

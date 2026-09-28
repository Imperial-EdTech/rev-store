"use client";

import { MapPin, Package, Truck } from "lucide-react";
import { useMemo, useState } from "react";
import { formatNaira } from "@/lib/catalog";
import type { Order } from "@/lib/orders/schema";
import { ORDER_STATUS, PAID_ORDER_STATUSES, type OrderStatus } from "@/lib/statuses";
import {
  EmptyState, ErrorState, FilterPill, LoadingState, Panel, StatCard, StatusSelect, Table,
  ContactCell, exportToExcel, formatDate, patchStatus, useAdminList,
} from "./kit";

/** Admin → Orders: every order, its customer, items and status. */
export function OrdersView() {
  const { load, reload, setData } = useAdminList<Order>("/api/admin/orders", "orders");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const orders = load.state === "ready" ? load.data : [];

  const counts = useMemo(() => {
    const c = Object.fromEntries(ORDER_STATUS.list.map((s) => [s.value, 0])) as Record<OrderStatus, number>;
    for (const o of orders) c[o.status]++;
    return c;
  }, [orders]);

  const revenue = useMemo(
    () => orders.filter((o) => PAID_ORDER_STATUSES.includes(o.status)).reduce((sum, o) => sum + o.total, 0),
    [orders],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) =>
      (status === "all" || o.status === status) &&
      (!q || [o.ref, o.customerName, o.customerEmail, o.customerPhone, ...o.items.map((i) => i.name)].join(" ").toLowerCase().includes(q)));
  }, [orders, query, status]);

  async function update(id: string, next: OrderStatus) {
    const body = await patchStatus(`/api/admin/orders/${id}`, next);
    if (!body?.order) return false;
    setData((list) => list.map((o) => (o.id === id ? (body.order as Order) : o)));
    return true;
  }

  if (load.state === "loading") return <LoadingState label="Loading orders…" />;
  if (load.state === "error") return <ErrorState message={load.error} onRetry={reload} />;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total orders" value={orders.length} />
        <StatCard label="Awaiting payment" value={counts.awaiting_payment} sub="Match transfers by order ID" />
        <StatCard label="To fulfil" value={counts.paid + counts.processing + counts.ready_for_pickup + counts.out_for_delivery} sub="Paid, not yet completed" />
        <StatCard label="Revenue received" value={formatNaira(revenue)} sub="Paid and later stages" />
      </div>

      <Panel
        canExport={filtered.length > 0}
        filters={[{ value: "all" as const, label: "All" }, ...ORDER_STATUS.list].map((s) => (
          <FilterPill active={status === s.value} key={s.value} onClick={() => setStatus(s.value)}>
            {s.label} <span className="opacity-60">{s.value === "all" ? orders.length : counts[s.value]}</span>
          </FilterPill>
        ))}
        onExport={() => exportToExcel(filtered.map((o) => ({
          "Order ID": o.ref, Date: formatDate(o.createdAt), Status: ORDER_STATUS.label(o.status),
          Name: o.customerName, Email: o.customerEmail, Phone: o.customerPhone,
          Items: o.items.map((i) => `${i.qty} × ${i.name}`).join("; "), "Total (₦)": o.total,
          Fulfilment: o.fulfillment === "pickup" ? "Pickup" : "Delivery", "Delivery address": o.deliveryAddress ?? "",
        })), "Orders", "revstore-orders")}
        onQuery={setQuery}
        onRefresh={reload}
        placeholder="Order ID, name, email, phone…"
        query={query}
      >
        {orders.length === 0 ? (
          <EmptyState body="Orders appear here as soon as a customer reaches the payment step at checkout." title="No orders yet" />
        ) : filtered.length === 0 ? (
          <p className="p-10 text-center text-sm text-slate-body">No orders match this filter.</p>
        ) : (
          <Table headings={["Order", "Customer", "Items", "Total", "Fulfilment", "Status"]}>
            {filtered.map((o) => (
              <tr className="border-t border-black/5 align-top hover:bg-black/[0.012]" key={o.id}>
                <td className="px-5 py-4">
                  <p className="font-mono text-[13px] font-bold text-slate-ink">{o.ref}</p>
                  <p className="mt-1 text-xs text-slate-body/60">{formatDate(o.createdAt)}</p>
                </td>
                <td className="px-5 py-4"><ContactCell email={o.customerEmail} name={o.customerName} phone={o.customerPhone} /></td>
                <td className="px-5 py-4">
                  <ul className="space-y-1">
                    {o.items.map((i) => (
                      <li className="text-slate-ink" key={i.productId}>
                        <span className="font-bold">{i.qty} ×</span> {i.name}
                        <span className="ml-1 text-xs text-slate-body/60">@ {formatNaira(i.unitPrice)}</span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-5 py-4 font-display text-base font-extrabold text-slate-ink">{formatNaira(o.total)}</td>
                <td className="max-w-[220px] px-5 py-4 text-slate-body">
                  {o.fulfillment === "pickup" ? (
                    <span className="inline-flex items-center gap-1.5 font-bold text-slate-ink"><Package className="h-4 w-4" /> Pickup</span>
                  ) : (
                    <>
                      <span className="inline-flex items-center gap-1.5 font-bold text-slate-ink"><Truck className="h-4 w-4" /> Delivery</span>
                      <p className="mt-1 flex gap-1 text-xs leading-5"><MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />{o.deliveryAddress}</p>
                    </>
                  )}
                </td>
                <td className="w-[200px] px-5 py-4">
                  <StatusSelect
                    changedAt={o.statusChangedAt}
                    label={`Status for order ${o.ref}`}
                    onChange={(next) => update(o.id, next)}
                    options={ORDER_STATUS.list}
                    tone={ORDER_STATUS.tone}
                    value={o.status}
                  />
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Panel>
    </div>
  );
}

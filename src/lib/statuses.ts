import { z } from "zod";

/**
 * Status lifecycles for orders, financing applications and leads.
 *
 * These mirror the CHECK constraints in supabase/migrations/20260928000000_initial_schema.sql.
 * If you add a status here, add it there too (in a new migration).
 */

type StatusDef<V extends string> = { value: V; label: string; tone: StatusTone };
export type StatusTone = "neutral" | "waiting" | "active" | "success" | "danger";

function defineStatuses<const V extends string>(list: readonly StatusDef<V>[]) {
  const values = list.map((s) => s.value) as [V, ...V[]];
  return {
    list,
    schema: z.enum(values),
    label: (v: V) => list.find((s) => s.value === v)?.label ?? v,
    tone: (v: V) => list.find((s) => s.value === v)?.tone ?? "neutral",
  };
}

export const ORDER_STATUS = defineStatuses([
  { value: "awaiting_payment", label: "Awaiting payment", tone: "waiting" },
  { value: "paid", label: "Paid", tone: "success" },
  { value: "processing", label: "Processing", tone: "active" },
  { value: "ready_for_pickup", label: "Ready for pickup", tone: "active" },
  { value: "out_for_delivery", label: "Out for delivery", tone: "active" },
  { value: "completed", label: "Completed", tone: "neutral" },
  { value: "cancelled", label: "Cancelled", tone: "danger" },
  { value: "refunded", label: "Refunded", tone: "danger" },
] as const);
export type OrderStatus = z.infer<typeof ORDER_STATUS.schema>;

export const APPLICATION_STATUS = defineStatuses([
  { value: "submitted", label: "Submitted", tone: "waiting" },
  { value: "under_review", label: "Under review", tone: "active" },
  { value: "documents_requested", label: "Documents requested", tone: "waiting" },
  { value: "approved", label: "Approved", tone: "success" },
  { value: "declined", label: "Declined", tone: "danger" },
  { value: "withdrawn", label: "Withdrawn", tone: "neutral" },
  { value: "device_delivered", label: "Device delivered", tone: "success" },
  { value: "repaying", label: "Repaying", tone: "active" },
  { value: "completed", label: "Completed", tone: "neutral" },
  { value: "defaulted", label: "Defaulted", tone: "danger" },
] as const);
export type ApplicationStatus = z.infer<typeof APPLICATION_STATUS.schema>;

export const LEAD_STATUS = defineStatuses([
  { value: "new", label: "New", tone: "waiting" },
  { value: "contacted", label: "Contacted", tone: "active" },
  { value: "qualified", label: "Qualified", tone: "active" },
  { value: "converted", label: "Converted", tone: "success" },
  { value: "not_interested", label: "Not interested", tone: "neutral" },
  { value: "unreachable", label: "Unreachable", tone: "danger" },
] as const);
export type LeadStatus = z.infer<typeof LEAD_STATUS.schema>;

/** Order statuses that mean the money has been received. */
export const PAID_ORDER_STATUSES: OrderStatus[] = ["paid", "processing", "ready_for_pickup", "out_for_delivery", "completed"];

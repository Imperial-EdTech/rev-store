import { z } from "zod";
import { MAX_QTY_PER_LINE } from "@/lib/cart/limits";
import type { OrderStatus } from "@/lib/statuses";

/**
 * Order rules shared by the checkout form (client) and /api/orders (server),
 * so both validate customer details the same way.
 */

export const buyerSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your full name").max(120),
    phone: z
      .string()
      .trim()
      .refine((v) => {
        const digits = v.replace(/\D/g, "").length;
        return digits >= 10 && digits <= 14;
      }, "Enter a phone number, e.g. 0803 123 4567"),
    email: z.string().trim().max(200).email("Enter an email address, e.g. name@school.edu.ng"),
    fulfillment: z.enum(["pickup", "delivery"]),
    address: z.string().trim().max(500),
  })
  .superRefine((b, ctx) => {
    if (b.fulfillment === "delivery" && b.address.length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["address"],
        message: "Enter the full delivery address, including city and state",
      });
    }
  });

export type Buyer = z.infer<typeof buyerSchema>;

export const orderRequestSchema = z.object({
  clientKey: z.string().uuid(),
  buyer: buyerSchema,
  items: z
    .array(z.object({ productId: z.string().min(1).max(80), qty: z.number().int().min(1).max(MAX_QTY_PER_LINE) }))
    .min(1)
    .max(20),
});

export type OrderRequest = z.infer<typeof orderRequestSchema>;

export type OrderLine = { productId: string; name: string; qty: number; unitPrice: number; lineTotal: number };

/** Order as returned by the API (camelCase). */
export type Order = {
  id: string;
  ref: string;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  fulfillment: "pickup" | "delivery";
  deliveryAddress: string | null;
  items: OrderLine[];
  total: number;
  createdAt: string;
  updatedAt: string;
  statusChangedAt: string;
};

/** First error message per field, for showing under form inputs. */
export function fieldErrors<T extends string>(error: z.ZodError): Partial<Record<T, string>> {
  const out: Partial<Record<T, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as T | undefined;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

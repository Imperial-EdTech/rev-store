import { NextResponse } from "next/server";
import { invalidRequest, readJson } from "@/lib/db";
import { orderRequestSchema } from "@/lib/orders/schema";
import { saveOrder } from "@/lib/orders/server";

/**
 * POST /api/orders: called by checkout when the customer continues to payment.
 * Public by design; prices are recalculated on the server, so the request only
 * chooses products and quantities.
 */
export async function POST(request: Request) {
  const parsed = orderRequestSchema.safeParse(await readJson(request));
  if (!parsed.success) return invalidRequest(parsed.error);
  const result = await saveOrder(parsed.data);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });

  const { ref, lines, total } = result.value;
  return NextResponse.json({ order: { ref, items: lines, total } }, { status: 201 });
}

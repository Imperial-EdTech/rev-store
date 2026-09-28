import { NextResponse } from "next/server";
import { invalidRequest, isUuid, readJson, toResponse } from "@/lib/db";
import { likeSchema } from "@/lib/revlearn/schema";
import { setLike } from "@/lib/revlearn/server";

/** POST { liked }: add or remove this browser's like. Returns the new count. Public. */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isUuid(id)) return NextResponse.json({ error: "Post not found." }, { status: 404 });
  const parsed = likeSchema.safeParse(await readJson(request));
  if (!parsed.success) return invalidRequest(parsed.error);
  return toResponse(await setLike(id, parsed.data.liked), (value) => value);
}

import { NextResponse } from "next/server";
import { invalidRequest, isUuid, readJson, toResponse } from "@/lib/db";
import { commentSchema } from "@/lib/revlearn/schema";
import { createComment } from "@/lib/revlearn/server";

/** POST: reply to a post. Public. */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isUuid(id)) return NextResponse.json({ error: "Post not found." }, { status: 404 });
  const parsed = commentSchema.safeParse(await readJson(request));
  if (!parsed.success) return invalidRequest(parsed.error);
  return toResponse(await createComment(id, parsed.data), (comment) => ({ comment }), 201);
}

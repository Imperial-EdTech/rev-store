import { NextResponse } from "next/server";
import { isUuid, toResponse } from "@/lib/db";
import { getPost } from "@/lib/revlearn/server";

/** GET: one post with its comments. Public. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isUuid(id)) return NextResponse.json({ error: "Post not found." }, { status: 404 });
  return toResponse(await getPost(id), (value) => value);
}

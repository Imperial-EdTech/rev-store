import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guard";
import { toResponse } from "@/lib/db";
import { uploadThumbnail } from "@/lib/revlearn/server";

/** POST multipart { file }: stores a course thumbnail, returns { url }. Admin only. */
export async function POST(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });
  return toResponse(await uploadThumbnail(file), (value) => value, 201);
}

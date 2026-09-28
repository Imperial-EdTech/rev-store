import { invalidRequest, readJson, toResponse } from "@/lib/db";
import { postSchema } from "@/lib/revlearn/schema";
import { createPost, listPosts } from "@/lib/revlearn/server";

/** GET: the newest community posts with comment counts. Public. */
export async function GET() {
  return toResponse(await listPosts(), (posts) => ({ posts }));
}

/** POST: share a post. Public. */
export async function POST(request: Request) {
  const parsed = postSchema.safeParse(await readJson(request));
  if (!parsed.success) return invalidRequest(parsed.error);
  return toResponse(await createPost(parsed.data), (post) => ({ post }), 201);
}

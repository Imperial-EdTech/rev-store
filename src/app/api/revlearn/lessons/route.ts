import { adminContentRoutes } from "@/lib/revlearn/routes";
import { lessonSchema } from "@/lib/revlearn/schema";

/** POST (save) and DELETE { id } a single lesson. Admin only. */
export const { POST, DELETE } = adminContentRoutes("lesson", lessonSchema);

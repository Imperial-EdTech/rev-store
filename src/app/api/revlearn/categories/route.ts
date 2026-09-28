import { adminContentRoutes } from "@/lib/revlearn/routes";
import { categorySchema } from "@/lib/revlearn/schema";

/** POST (save) and DELETE { id } a category. Deleting removes its courses and lessons. Admin only. */
export const { POST, DELETE } = adminContentRoutes("category", categorySchema);

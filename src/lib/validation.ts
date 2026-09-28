import { z } from "zod";

/**
 * Field rules shared by every public form and its API route, so a value the
 * form accepts is never rejected by the server (or the other way round).
 */

/** A phone number with 10–15 digits, however it's spaced: 0803 123 4567, +234 803 123 4567. */
export const phoneNumber = z
  .string()
  .trim()
  .refine((v) => {
    const digits = v.replace(/\D/g, "").length;
    return digits >= 10 && digits <= 15;
  }, "Enter a valid phone number, e.g. 0803 123 4567");

export const emailAddress = z.string().trim().max(200).email("Enter a valid email address, e.g. name@school.edu.ng");

/** Optional free text: blank becomes undefined, so it isn't stored as "". */
export const optionalText = (max: number) =>
  z.preprocess((v) => (typeof v === "string" && v.trim() === "" ? undefined : v), z.string().trim().max(max).optional());

/** Optional whole number from a text or number input: blank becomes undefined. */
export const optionalCount = (message: string) =>
  z.preprocess(
    (v) => (v === "" || v === null || v === undefined || (typeof v === "number" && Number.isNaN(v)) ? undefined : v),
    z.coerce.number({ invalid_type_error: message }).int(message).positive(message).max(1_000_000, message).optional(),
  );

/** Maps a ZodError to the first message per top-level field, for showing under inputs. */
export function fieldErrors<T extends string>(error: z.ZodError): Partial<Record<T, string>> {
  const out: Partial<Record<T, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as T | undefined;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

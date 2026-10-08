import "server-only";
import { dbFailure, getDb, notConfigured, type Result } from "@/lib/db";
import { NOMINATION_NOTICE_VERSION, type Nomination, type NominationRequest, type NominationStatus, type NominatorRole } from "./schema";

export async function submitNomination(req: NominationRequest): Promise<Result<{ id: string; ref: string }>> {
  const db = getDb();
  if (!db) return notConfigured;
  const { data, error } = await db.rpc("submit_teacher_nomination", {
    p: {
      nominator: { name: req.nominatorName, phone: req.nominatorPhone, role: req.nominatorRole },
      teacher: { name: req.teacherName, phone: req.teacherPhone, subject: req.teacherSubject ?? null },
      school: { name: req.schoolName, state: req.schoolState },
      reason: req.reason,
      consent: {
        notice_version: NOMINATION_NOTICE_VERSION,
        age_confirmed: req.ageConfirmed,
        marketing_opt_in: req.marketingOptIn,
      },
    },
  });
  if (error) return dbFailure("nominations: submit", error, "Could not save your nomination. Please try again.");
  return { ok: true, value: { id: data.id as string, ref: data.ref as string } };
}

// ─── Reading ──────────────────────────────────────────────────

type NominationRow = {
  id: string; ref: string; status: NominationStatus; created_at: string;
  nominator_name: string; nominator_phone: string; nominator_role: NominatorRole;
  teacher_name: string; teacher_phone: string; teacher_subject: string | null;
  school_name: string; school_state: string; reason: string; marketing_opt_in: boolean | null;
};

function toNomination(r: NominationRow): Nomination {
  return {
    id: r.id,
    ref: r.ref,
    status: r.status,
    createdAt: r.created_at,
    nominator: { name: r.nominator_name, phone: r.nominator_phone, role: r.nominator_role },
    teacher: { name: r.teacher_name, phone: r.teacher_phone, subject: r.teacher_subject },
    school: { name: r.school_name, state: r.school_state },
    reason: r.reason,
    marketingOptIn: r.marketing_opt_in === true,
  };
}

export async function listNominations(): Promise<Result<Nomination[]>> {
  const db = getDb();
  if (!db) return notConfigured;
  const { data, error } = await db
    .from("teacher_nominations")
    .select("id, ref, status, created_at, nominator_name, nominator_phone, nominator_role, teacher_name, teacher_phone, teacher_subject, school_name, school_state, reason, marketing_opt_in")
    .order("created_at", { ascending: false })
    .limit(5000);
  if (error) return dbFailure("nominations: list", error, "Could not load nominations.");
  return { ok: true, value: (data as NominationRow[]).map(toNomination) };
}

/**
 * Permanently deletes a nomination: for a teacher who objects at first
 * contact, or anyone exercising their right to erasure (NDPA s.34, GDPR art. 17).
 */
export async function deleteNomination(id: string): Promise<Result<null>> {
  const db = getDb();
  if (!db) return notConfigured;
  const { data, error } = await db.from("teacher_nominations").delete().eq("id", id).select("id");
  if (error) return dbFailure("nominations: delete", error, "Could not delete the nomination.");
  if (!data?.length) return { ok: false, status: 404, error: "Not found." };
  return { ok: true, value: null };
}

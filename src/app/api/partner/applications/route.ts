import { NextResponse } from "next/server";
import { listApplications } from "@/lib/applications/server";
import { requirePartner } from "@/lib/auth/guard";
import { getPartner, type PartnerApplicant } from "@/lib/partners";
import { APPLICATION_STATUS } from "@/lib/statuses";

/**
 * GET /api/partner/applications: only the signed-in partner's applicants.
 * Filtered on the server by the sponsoring organisation.
 */
export async function GET(request: Request) {
  const auth = await requirePartner(request);
  if (auth instanceof NextResponse) return auth;
  const partner = getPartner(auth.partnerId);
  if (!partner) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const result = await listApplications({ sponsorSlug: partner.id });
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });

  // Partners see who applied and how far each application has got, not
  // contact details or financial answers (those stay with the Revrica team).
  const applications: PartnerApplicant[] = result.value.map((a) => ({
    ref: a.ref,
    name: a.contact.name,
    school: a.school,
    state: a.contact.state,
    device: a.product?.name ?? null,
    termMonths: a.termMonths,
    status: a.status,
    statusLabel: APPLICATION_STATUS.label(a.status),
    createdAt: a.createdAt,
  }));
  return NextResponse.json({ applications });
}

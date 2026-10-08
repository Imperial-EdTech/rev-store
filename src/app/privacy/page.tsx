import type { Metadata } from "next";
import type { ReactNode } from "react";
import { StorefrontFooter } from "@/components/StorefrontFooter";
import { StorefrontHeader } from "@/components/StorefrontHeader";
import { PRIVACY } from "@/lib/privacy";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Revrica collects, uses and protects your personal data, and your rights under the NDPA 2023 and GDPR.",
  alternates: { canonical: "/privacy" },
};

/**
 * Privacy policy, written for the Nigeria Data Protection Act 2023 (NDPA) and,
 * where it applies, the EU/UK GDPR. Facts come from src/lib/privacy.ts.
 * Keep the "What we collect" table in step with the forms.
 */

const ACTIVITIES: { id?: string; what: string; data: string; why: string; basis: string }[] = [
  {
    what: "Buying from the shop",
    data: "Name, phone number, email, delivery address, the items you order and payment confirmation.",
    why: "To process, deliver and support your order, and keep tax and accounting records.",
    basis: "Performing our contract with you; legal obligation (records).",
  },
  {
    what: "Applying for device financing",
    data: "Name, phone, email, gender, school, role, state and LGA, years of teaching, salary band, budget and repayment preference, and your answers on the form.",
    why: "To assess your application and arrange financing with our financing partner and, where applicable, your sponsoring organisation.",
    basis: "Steps you ask us to take before entering a contract; your consent for identity (KYC) checks.",
  },
  {
    what: "Joining a waitlist or making a school enquiry",
    data: "Name, phone, email, organisation, role, what you're interested in, and any notes you add.",
    why: "To reply to you and tell you about the products and programmes you asked about.",
    basis: "Your consent, which you can withdraw at any time.",
  },
  {
    what: "School technology audits",
    data: "Contact name, role, phone, email, school name and your answers about the school's technology.",
    why: "To produce your audit results and recommend suitable devices and services.",
    basis: "Your consent; our legitimate interest in following up on your request.",
  },
  {
    what: "RevLearn community",
    data: "Your display name and the posts, comments and likes you choose to publish.",
    why: "To run the community. What you post is visible to other RevLearn users.",
    basis: "Performing the service you signed up for.",
  },
  {
    id: "nominations",
    what: "My Teacher, My Hero nominations",
    data: "About you: name, phone number and how you know the teacher. About the teacher: name, phone number, school, state, subject (optional), and why you nominated them.",
    why: "To verify each nomination with you and the teacher, and, only if the teacher agrees, to feature them publicly and run the public vote. Phone numbers are never published. We'll only send you news about Rev products if you ticked the optional box.",
    basis: "For you: your consent. For the teacher: our legitimate interest in recognising teachers, balanced by telling them at first contact and deleting the nomination if they object. We ask for the teacher's consent before publishing anything about them.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <StorefrontHeader />
      <main className="bg-white text-slate-ink">
        <div className="container-x max-w-3xl py-14 md:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-rev-orange">Legal</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-maroon-deep md:text-5xl">Privacy Policy</h1>
          <p className="mt-3 text-sm text-slate-body">Last updated {PRIVACY.lastUpdated}</p>

          <Section title="Who we are">
            <p>
              This policy explains how <strong>{PRIVACY.controller}</strong> (&ldquo;Revrica&rdquo;, &ldquo;we&rdquo;), working
              with {PRIVACY.partner}, collects and uses personal data on this website. We are the data controller for
              the data described here. We follow the Nigeria Data Protection Act 2023 (NDPA) and, where it applies to
              you, the EU and UK General Data Protection Regulation (GDPR).
            </p>
            <p>
              Contact us about your data at{" "}
              <a className="font-bold text-rev-orangeDeep underline" href={`mailto:${PRIVACY.contactEmail}`}>{PRIVACY.contactEmail}</a>{" "}
              or write to us at {PRIVACY.address}.
            </p>
          </Section>

          <Section title="What we collect, why, and our lawful basis">
            <p>We only collect what you give us in our forms. Each form collects only what that service needs:</p>
            <div className="mt-2 space-y-4">
              {ACTIVITIES.map((a) => (
                <div className="scroll-mt-28 rounded-2xl border border-black/8 bg-[#FAF8F6] p-5" id={a.id} key={a.what}>
                  <h3 className="font-display text-base font-bold text-slate-ink">{a.what}</h3>
                  <dl className="mt-3 grid gap-2 text-sm leading-6 sm:grid-cols-[8rem_1fr]">
                    <dt className="font-bold text-slate-ink">What</dt><dd>{a.data}</dd>
                    <dt className="font-bold text-slate-ink">Why</dt><dd>{a.why}</dd>
                    <dt className="font-bold text-slate-ink">Lawful basis</dt><dd>{a.basis}</dd>
                  </dl>
                </div>
              ))}
            </div>
            <p>
              We don&apos;t make decisions about you by purely automated means. We don&apos;t sell your personal data,
              and we don&apos;t use it for advertising on other websites.
            </p>
          </Section>

          <Section title="Details someone else gave us">
            <p>
              If someone nominated you for <strong>My Teacher, My Hero</strong>, they gave us your name, phone number,
              school and why they nominated you. When we first contact you, we&apos;ll tell you who we are and how we
              got your details. If you&apos;d rather not take part, tell us and we&apos;ll delete the nomination. We
              won&apos;t publish your name, photo or story without your agreement.
            </p>
          </Section>

          <Section title="Children">
            <p>
              Our services are for adults. Anyone under 18 needs a parent or guardian&apos;s consent before giving us
              personal data, including when nominating a teacher. If you believe a child has given us data without
              that consent, contact us and we&apos;ll delete it.
            </p>
          </Section>

          <Section title="Who we share it with">
            <ul className="list-disc space-y-2 pl-5">
              <li><strong>Financing partners</strong>: licensed financial institutions that assess and provide financing, for financing applications only.</li>
              <li><strong>Sponsoring organisations</strong>: if you apply through a partner programme, that partner can see your application.</li>
              <li><strong>Service providers</strong> that host our website and database and help us run it. They act only on our instructions, under contract.</li>
              <li><strong>Authorities</strong>, when the law requires it.</li>
            </ul>
            <p>If you choose to message us on WhatsApp, WhatsApp&apos;s own privacy policy applies to that conversation.</p>
          </Section>

          <Section title="International transfers">
            <p>
              Some of our service providers may store data outside Nigeria. When they do, we rely on the safeguards the
              NDPA (Part VIII) and GDPR require, such as adequacy decisions or contractual protections.
            </p>
          </Section>

          <Section title="How long we keep it">
            <ul className="list-disc space-y-2 pl-5">
              <li><strong>Orders:</strong> {PRIVACY.retention.orders}.</li>
              <li><strong>Financing applications:</strong> {PRIVACY.retention.applications}.</li>
              <li><strong>Waitlist and enquiries:</strong> {PRIVACY.retention.leads}.</li>
              <li><strong>Technology audits:</strong> {PRIVACY.retention.audits}.</li>
              <li><strong>Teacher nominations:</strong> {PRIVACY.retention.nominations}.</li>
            </ul>
            <p>After that we delete it, or anonymise it so it no longer identifies you.</p>
          </Section>

          <Section title="How we protect it">
            <p>
              Your data is stored in a database that the public cannot reach. Only our server can read or write it,
              and only authorised staff can view it, through a password-protected admin area. Connections to this
              website are encrypted.
            </p>
          </Section>

          <Section title="Your rights">
            <p>Under the NDPA (and the GDPR, where it applies) you have the right to:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>know what data we hold about you and get a copy of it;</li>
              <li>have inaccurate data corrected;</li>
              <li>have your data deleted;</li>
              <li>restrict or object to how we use it, including for marketing at any time;</li>
              <li>receive your data in a portable format;</li>
              <li>withdraw your consent at any time (this doesn&apos;t affect what we did before you withdrew it).</li>
            </ul>
            <p>
              Email{" "}
              <a className="font-bold text-rev-orangeDeep underline" href={`mailto:${PRIVACY.contactEmail}`}>{PRIVACY.contactEmail}</a>.
              We may ask you to confirm your identity, and we&apos;ll respond within 30 days. If you&apos;re not satisfied,
              you can complain to the Nigeria Data Protection Commission (ndpc.gov.ng) or, in the EU or UK, your local
              data protection authority.
            </p>
          </Section>

          <Section title="Cookies and browser storage">
            <p>
              We don&apos;t use advertising or tracking cookies. Your browser stores your shopping cart and display
              preferences on your device so the site works as you&apos;d expect. That information isn&apos;t sent to us
              until you place an order.
            </p>
          </Section>

          <Section title="Changes to this policy">
            <p>
              If we change this policy, we&apos;ll update it here and change the date at the top. If a change affects
              how we use data you&apos;ve already given us, we&apos;ll let you know first.
            </p>
          </Section>
        </div>
      </main>
      <StorefrontFooter />
    </>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="font-display text-2xl font-bold text-maroon-deep">{title}</h2>
      <div className="mt-4 space-y-4 text-[15px] leading-7 text-slate-body">{children}</div>
    </section>
  );
}

import Link from "next/link";

export function RevricaLogo() {
  return (
    <Link aria-label="RevStore home" className="inline-flex items-center" href="/">
      <span
        className="font-display text-[22px] font-black tracking-tight"
        style={{ fontFamily: "var(--font-display)" }}
      >
        <span className="text-white">Rev</span><span className="text-rev-orange">Store</span>
      </span>
    </Link>
  );
}

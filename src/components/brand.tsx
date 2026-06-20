import Image from "next/image";
import Link from "next/link";

export function RevricaLogo() {
  return (
    <Link aria-label="Revrica home" className="inline-flex items-center" href="/">
      <Image alt="Revrica" className="h-7 w-auto md:h-8" height={34} priority src="/brand/revrica-logo.png" width={198} />
    </Link>
  );
}

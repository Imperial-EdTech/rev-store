import { Noto_Serif } from "next/font/google";
import Link from "next/link";

const serif = Noto_Serif({ subsets: ["latin"], weight: ["700", "800"], style: ["normal", "italic"] });

const ORANGE = "#E2701E";

/**
 * RevStore logo: store icon, "Rev" + italic "Store" wordmark, "Shop the best deals" tagline.
 * Transparent background, so it works on dark and light backgrounds.
 * On dark BG the icon and "Rev" are white; pass variant="light" on white/light
 * backgrounds to draw them in brand maroon. "Store" and the tagline are always orange.
 * Text widths are pinned with textLength so the layout holds whatever font loads.
 */
export function RevricaLogo({
  className,
  variant = "dark",
}: {
  className?: string;
  variant?: "dark" | "light";
}) {
  const ink = variant === "light" ? "#581319" : "#F2F0F2";
  const font = serif.style.fontFamily;

  return (
    <Link aria-label="RevStore home" className="inline-flex items-center" href="/">
      <svg
        aria-hidden
        className={className ?? "h-10 w-auto sm:h-11"}
        fill="none"
        viewBox="0 0 640 128"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Store icon: roof, striped awning, pillar, door gap, shop window */}
        <path d="M14 8h100l10 38H4z" fill={ink} />
        <rect fill={ORANGE} height="18" width="28" x="8" y="47" />
        <rect fill={ink} height="18" width="28" x="36" y="47" />
        <rect fill={ORANGE} height="18" width="28" x="64" y="47" />
        <rect fill={ink} height="18" width="28" x="92" y="47" />
        <rect fill={ink} height="54" width="13" x="8" y="65" />
        <path d="M52 65h68v54H52z" fill={ink} />
        <rect fill={ORANGE} height="27" width="32" x="78" y="65" />

        {/* Wordmark */}
        <text
          fill={ink}
          fontFamily={font}
          fontSize="104"
          fontWeight="800"
          lengthAdjust="spacingAndGlyphs"
          textLength="196"
          x="150"
          y="92"
        >
          Rev
        </text>
        <text
          fill={ORANGE}
          fontFamily={font}
          fontSize="104"
          fontStyle="italic"
          fontWeight="800"
          lengthAdjust="spacingAndGlyphs"
          textLength="284"
          x="350"
          y="92"
        >
          Store
        </text>

        {/* Tagline */}
        <text
          fill={ORANGE}
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontSize="22"
          fontWeight="600"
          lengthAdjust="spacing"
          textLength="400"
          x="152"
          y="124"
        >
          SHOP THE BEST DEALS
        </text>
      </svg>
    </Link>
  );
}

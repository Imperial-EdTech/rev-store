import Link from "next/link";

/**
 * RevStore logo — works on both dark and light backgrounds.
 * On dark BG: R and v are white, "e" and "Store" are orange.
 * On light BG: R and v are brand-dark (#581319), "e" and "Store" are orange.
 * Pass variant="light" for white/light backgrounds.
 */
export function RevricaLogo({
  className,
  variant = "dark",
}: {
  className?: string;
  variant?: "dark" | "light";
}) {
  const textColor = variant === "light" ? "#581319" : "#ffffff";

  return (
    <Link aria-label="RevStore home" className="inline-flex items-center" href="/">
      <svg
        className={className ?? "h-9 w-auto"}
        fill="none"
        viewBox="0 0 220 44"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Cart pill background */}
        <rect fill="#581319" height="36" rx="10" width="44" x="0" y="4" />

        {/* Cart handle */}
        <path
          d="M11 15h3.5l3 9h8l2.2-6.5H16"
          stroke="white"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        {/* Cart wheels */}
        <circle cx="18.5" cy="27" fill="white" r="1.6" />
        <circle cx="25.5" cy="27" fill="white" r="1.6" />
        {/* Laptop screen inside cart */}
        <rect fill="white" height="4.5" opacity="0.95" rx="1" width="7.5" x="17.5" y="16.5" />
        <rect fill="#FF6B1A" height="3" rx="0.6" width="6" x="18.25" y="17.25" />

        {/* "Rev" wordmark — R dark/white, e orange, v dark/white */}
        <text
          dominantBaseline="middle"
          fill={textColor}
          fontFamily="'Archivo Variable',ui-sans-serif,system-ui"
          fontSize="23"
          fontWeight="900"
          letterSpacing="-1"
          x="52"
          y="23"
        >
          R
        </text>
        <text
          dominantBaseline="middle"
          fill="#FF6B1A"
          fontFamily="'Archivo Variable',ui-sans-serif,system-ui"
          fontSize="23"
          fontWeight="900"
          letterSpacing="-1"
          x="69"
          y="23"
        >
          e
        </text>
        <text
          dominantBaseline="middle"
          fill={textColor}
          fontFamily="'Archivo Variable',ui-sans-serif,system-ui"
          fontSize="23"
          fontWeight="900"
          letterSpacing="-1"
          x="84"
          y="23"
        >
          v
        </text>

        {/* Divider */}
        <rect
          fill={variant === "light" ? "rgba(88,19,25,0.2)" : "rgba(255,255,255,0.2)"}
          height="20"
          rx="1"
          width="1.5"
          x="104"
          y="12"
        />

        {/* "Store" — always orange */}
        <text
          dominantBaseline="middle"
          fill="#FF6B1A"
          fontFamily="'Archivo Variable',ui-sans-serif,system-ui"
          fontSize="18"
          fontWeight="700"
          letterSpacing="0.5"
          x="110"
          y="23"
        >
          Store
        </text>
      </svg>
    </Link>
  );
}
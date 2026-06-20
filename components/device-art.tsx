"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Path to the real product photo. Drop your laptop photo at this exact
 * path (see public/devices/README.md) and it will replace the
 * illustration below automatically — no other code changes needed.
 */
const PHOTO_SRC = "/devices/rev-laptop.png";

/**
 * Renders the real product photo at PHOTO_SRC if it loads successfully,
 * and falls back to the built-in SVG illustration if the file is missing
 * (e.g. before a real photo has been added) so the hero never breaks.
 */
export function RevLaptop({ className }: { className?: string }) {
  const [photoFailed, setPhotoFailed] = useState(false);

  if (photoFailed) {
    return <RevLaptopIllustration className={className} />;
  }

  return (
    <Image
      alt="Rev laptop"
      className={className}
      height={620}
      onError={() => setPhotoFailed(true)}
      priority
      sizes="(min-width: 1024px) 560px, 90vw"
      src={PHOTO_SRC}
      style={{ width: "100%", height: "auto", objectFit: "contain" }}
      width={760}
    />
  );
}

/**
 * Stand-in product illustration for the Rev laptop. Built as layered SVG
 * with real perspective and gradient depth so it reads as a product photo,
 * not an icon. Used automatically as a fallback until a real photo is
 * added at public/devices/rev-laptop.png.
 */
export function RevLaptopIllustration({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="-40 0 840 620"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="lidBack" x1="0.1" x2="0.9" y1="0" y2="1">
          <stop offset="0%" stopColor="#5a5a5e" />
          <stop offset="35%" stopColor="#2c2c30" />
          <stop offset="70%" stopColor="#161618" />
          <stop offset="100%" stopColor="#080809" />
        </linearGradient>
        <linearGradient id="bezel" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#0c0c0d" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>
        <linearGradient id="screenGrad" x1="0.15" x2="0.85" y1="0" y2="1">
          <stop offset="0%" stopColor="#8a2226" />
          <stop offset="40%" stopColor="#4a0e10" />
          <stop offset="100%" stopColor="#0e0203" />
        </linearGradient>
        <linearGradient id="screenSheen" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.16" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.02" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="deckTop" x1="0" x2="1" y1="0" y2="0.3">
          <stop offset="0%" stopColor="#48484c" />
          <stop offset="22%" stopColor="#343437" />
          <stop offset="55%" stopColor="#1f1f22" />
          <stop offset="100%" stopColor="#0c0c0d" />
        </linearGradient>
        <linearGradient id="deckFront" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#1a1a1c" />
          <stop offset="100%" stopColor="#020202" />
        </linearGradient>
        <radialGradient cx="50%" cy="0%" id="hingeglow" r="80%">
          <stop offset="0%" stopColor="#ff8a3d" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ff8a3d" stopOpacity="0" />
        </radialGradient>
        <filter height="200%" id="ds" width="200%" x="-50%" y="-50%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="20" />
          <feOffset dy="34" result="ob" />
          <feComponentTransfer>
            <feFuncA slope="0.55" type="linear" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ambient ground shadow */}
      <ellipse cx="380" cy="560" fill="#000000" opacity="0.4" rx="260" ry="26" />

      <g filter="url(#ds)">
        {/* ===== LID / SCREEN (slightly tilted back) ===== */}
        <g>
          <path
            d="M150 60 L610 60 L600 380 L160 380 Z"
            fill="url(#lidBack)"
          />
          {/* inner bezel */}
          <path d="M168 76 L592 76 L584 364 L176 364 Z" fill="url(#bezel)" />
          {/* screen */}
          <path d="M180 90 L580 90 L573 350 L187 350 Z" fill="url(#screenGrad)" />
          {/* screen UI hint, simplified dashboard */}
          <g opacity="0.92">
            <rect fill="#ffffff" fillOpacity="0.1" height="14" rx="4" width="120" x="206" y="112" />
            <rect fill="#FF6B1A" height="52" rx="9" width="170" x="206" y="138" />
            <rect fill="#ffffff" fillOpacity="0.14" height="52" rx="9" width="124" x="386" y="138" />
            <rect fill="#ffffff" fillOpacity="0.08" height="8" rx="3" width="260" x="206" y="212" />
            <rect fill="#ffffff" fillOpacity="0.08" height="8" rx="3" width="200" x="206" y="227" />
            <rect fill="#ffffff" fillOpacity="0.08" height="8" rx="3" width="230" x="206" y="242" />
          </g>
          {/* glass sheen across screen */}
          <path d="M180 90 L580 90 L573 350 L187 350 Z" fill="url(#screenSheen)" />
          {/* camera dot */}
          <circle cx="380" cy="68" fill="#000000" r="3" />
          <circle cx="380" cy="68" fill="#3a3a3d" r="1.4" />
        </g>

        {/* hinge glow */}
        <rect fill="url(#hingeglow)" height="40" width="500" x="130" y="370" />
        {/* hinge bar */}
        <rect fill="#050506" height="12" rx="3" width="466" x="147" y="382" />

        {/* ===== BASE / KEYBOARD DECK (perspective trapezoid) ===== */}
        <path d="M70 398 L690 398 L760 520 L0 520 Z" fill="url(#deckTop)" />
        {/* keyboard recess */}
        <path d="M120 412 L640 412 L690 500 L70 500 Z" fill="#050506" opacity="0.5" />
        {/* keyboard key hint rows */}
        <g opacity="0.3">
          <rect fill="#000000" height="5" rx="2" width="440" x="160" y="428" />
          <rect fill="#000000" height="5" rx="2" width="420" x="170" y="441" />
          <rect fill="#000000" height="5" rx="2" width="400" x="180" y="454" />
        </g>
        {/* trackpad */}
        <rect fill="#020203" fillOpacity="0.6" height="28" rx="7" width="150" x="305" y="468" />
        {/* front edge / thickness face */}
        <path d="M0 520 L760 520 L760 532 C760 538 754 542 747 542 L13 542 C6 542 0 538 0 532 Z" fill="url(#deckFront)" />
        {/* brand notch on front lip */}
        <rect fill="#FF6B1A" height="3" rx="1.5" width="22" x="369" y="529" />
      </g>
    </svg>
  );
}
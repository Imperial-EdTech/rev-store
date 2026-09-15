"use client";

import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { RevricaLogo } from "@/components/brand";

const MAROON = "#4a0e10";

const FOOTER_LINKS = {
  "Customer Service": [
    ["FAQ",                "/faq"],
    ["Warranty Policy",    "/warranty"],
    ["Privacy Policy",     "/privacy"],
    ["Terms & Conditions", "/terms"],
  ],
  "Shop": [
    ["All Products",  "/products"],
    ["Laptops",       "/products"],
    ["Tablets",       "/products/tablets"],
    ["All-in-Ones",   "#"],
    ["Mini PCs",      "#"],
  ],
  "Information": [
    ["About Us",             "/about"],
    ["Teacher Empowerment",  "/teacher-empowerment"],
    ["Apply for Financing",  "/apply"],
    ["Find a Store",         "#"],
    ["Contact Us",           "#"],
  ],
};

/**
 * Shared storefront footer — matches the homepage design exactly.
 *
 * Layout:
 *   1. White main body   — brand column (logo · phone · address · socials)
 *                          + Customer Service / Shop / Information link columns
 *   2. Light grey bottom bar — copyright + payment badges
 */
export function StorefrontFooter() {
  const [email,      setEmail]      = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer style={{ fontFamily: "'Plus Jakarta Sans','Inter Variable',ui-sans-serif,system-ui" }}>

      {/* ── Main body ── */}
      <div style={{ background: "#fff", padding: "48px 20px 36px", borderTop: "1px solid #ebebeb" }}>
        <div
          style={{ maxWidth: 1240, margin: "0 auto" }}
          className="sf-footer-cols"
        >
          {/* Column 1 — brand */}
          <div>
            <div style={{ marginBottom: 20 }}>
              <RevricaLogo variant="light" />
            </div>

            {/* Phone */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 18 }}>
              <div style={{
                width: 38, height: 38, borderRadius: "50%",
                background: "#f0f0f0", display: "flex",
                alignItems: "center", justifyContent: "center",
                flexShrink: 0, marginTop: 2,
              }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                  stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.12 1.18 2 2 0 012.1 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 3px" }}>Got questions? Call us!</p>
                <p style={{ fontSize: 15, fontWeight: 700, color: MAROON, margin: 0, lineHeight: 1.4 }}>
                  +234 813 611 7198
                </p>
              </div>
            </div>

            {/* Address */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 13.5, fontWeight: 700, color: "#111", margin: "0 0 4px" }}>Contact info</p>
              <p style={{ fontSize: 13, color: "#6b7280", margin: 0, lineHeight: 1.7 }}>Lagos, Nigeria</p>
              <p style={{ fontSize: 13, color: "#6b7280", margin: 0, lineHeight: 1.7 }}>support@revrica.com</p>
            </div>

            {/* Newsletter */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#111", margin: "0 0 10px" }}>Newsletter</p>
              <div style={{ display: "flex" }}>
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && email) setSubscribed(true); }}
                  style={{
                    flex: 1, height: 40,
                    borderRadius: "100px 0 0 100px",
                    border: "1.5px solid #e8e8e8",
                    borderRight: "none",
                    background: "#fafafa",
                    padding: "0 14px",
                    fontSize: 12.5, color: "#374151", outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  onClick={() => { if (email) setSubscribed(true); }}
                  type="button"
                  style={{
                    height: 40, padding: "0 16px",
                    borderRadius: "0 100px 100px 0",
                    border: "1.5px solid #e8e8e8",
                    borderLeft: "none",
                    background: MAROON,
                    color: "#fff",
                    fontSize: 11.5, fontWeight: 800,
                    cursor: "pointer",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {subscribed ? "Done ✓" : "Subscribe"}
                </button>
              </div>
            </div>

            {/* Social icons */}
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { Icon: Facebook,  label: "Facebook" },
                { Icon: Instagram, label: "Instagram" },
                { Icon: Twitter,   label: "X / Twitter" },
                { Icon: Youtube,   label: "YouTube" },
              ].map(({ Icon, label }) => (
                <a key={label} href="#" aria-label={label}
                  style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: "#374151",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    textDecoration: "none", flexShrink: 0,
                  }}>
                  <Icon size={15} color="#fff" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <p style={{
                fontSize: 13, fontWeight: 800, color: "#111",
                letterSpacing: "0.06em", textTransform: "uppercase",
                margin: "0 0 18px",
              }}>
                {heading}
              </p>
              {links.map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  style={{ display: "block", fontSize: 13.5, color: "#6b7280", textDecoration: "none", marginBottom: 12, transition: "color 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = MAROON)}
                  onMouseLeave={e => (e.currentTarget.style.color = "#6b7280")}
                >
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{ background: "#f5f5f5", padding: "14px 20px" }}>
        <div style={{
          maxWidth: 1240, margin: "0 auto",
          display: "flex", alignItems: "center",
          justifyContent: "space-between", flexWrap: "wrap", gap: 10,
        }}>
          <p style={{ fontSize: 12.5, color: "#9ca3af", margin: 0 }}>
            © {new Date().getFullYear()} RevStore by Revrica — All rights reserved
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {[
              { name: "Paystack",    initial: "P" },
              { name: "Flutterwave", initial: "F" },
            ].map(({ name, initial }) => (
              <div key={name} style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "5px 12px", background: "#fff",
                borderRadius: 7, border: "1px solid #e8e8e8",
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: 4,
                  background: MAROON,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontSize: 9, fontWeight: 900, color: "#fff" }}>{initial}</span>
                </div>
                <span style={{ fontSize: 11.5, fontWeight: 800, color: "#374151", letterSpacing: "0.02em" }}>
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive grid */}
      <style>{`
        .sf-footer-cols {
          display: grid;
          grid-template-columns: 1.7fr 1fr 1fr 1fr;
          gap: 40px;
        }
        @media (max-width: 1024px) { .sf-footer-cols { grid-template-columns: 1.4fr 1fr 1fr !important; } }
        @media (max-width: 768px)  { .sf-footer-cols { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 480px)  { .sf-footer-cols { grid-template-columns: 1fr !important; } }
      `}</style>
    </footer>
  );
}
"use client";

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
    ["Tablets",       "/products"],
    ["All-in-Ones",   "#"],
    ["Mini PCs",      "#"],
  ],
  "Information": [
    ["About Us",               "/about"],
    ["Teacher Empowerment",    "/teacher-empowerment"],
    ["Apply for Financing",    "/apply"],
    ["Find a Store",           "#"],
    ["Contact Us",             "#"],
  ],
};

export function StorefrontFooter() {
  const [email,      setEmail]      = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer style={{ fontFamily: "'Plus Jakarta Sans','Inter Variable',ui-sans-serif,system-ui" }}>

      {/* ── Newsletter band ── */}
      <div style={{ background: MAROON, padding: "22px 20px" }}>
        <div style={{
          maxWidth: 1280, margin: "0 auto",
          display: "flex", alignItems: "center",
          justifyContent: "space-between", flexWrap: "wrap", gap: 16,
        }}>
          <p style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: 0 }}>
            Sign up to Newsletter
          </p>
          <div style={{ display: "flex", width: "100%", maxWidth: 500 }}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && email) setSubscribed(true); }}
              style={{
                flex: 1, height: 46,
                borderRadius: "100px 0 0 100px",
                border: "none", background: "#fff",
                padding: "0 20px", fontSize: 13.5,
                color: "#374151", outline: "none",
                boxSizing: "border-box",
              }}
            />
            <button
              onClick={() => { if (email) setSubscribed(true); }}
              type="button"
              style={{
                height: 46, padding: "0 24px",
                borderRadius: "0 100px 100px 0",
                border: "none", background: "#111",
                color: "#fff", fontSize: 12, fontWeight: 800,
                cursor: "pointer", letterSpacing: "0.06em",
                textTransform: "uppercase", whiteSpace: "nowrap", flexShrink: 0,
              }}
            >
              {subscribed ? "Subscribed ✓" : "Subscribe"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Main body ── */}
      <div style={{ background: "#fff", padding: "48px 20px 36px", borderBottom: "1px solid #ebebeb" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }} className="rev-footer-grid">
          {/* Brand column */}
          <div>
            <div style={{ marginBottom: 20 }}>
              <RevricaLogo variant="light" />
            </div>
            {/* Phone */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 18 }}>
              <div style={{
                width: 38, height: 38, borderRadius: "50%",
                background: "#f0f0f0", display: "flex",
                alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2,
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
            {/* Social icons — dark circles matching Slot */}
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { label: "Facebook",  d: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
                { label: "Instagram", d: "M16 2H8a6 6 0 00-6 6v8a6 6 0 006 6h8a6 6 0 006-6V8a6 6 0 00-6-6zM12 16a4 4 0 110-8 4 4 0 010 8zm4.5-9a1 1 0 110-2 1 1 0 010 2z" },
                { label: "X / Twitter", d: "M4 4l16 16M4 20L20 4" },
                { label: "YouTube",   d: "M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" },
              ].map(({ label, d }) => (
                <a key={label} href="#" aria-label={label}
                  style={{ width: 36, height: 36, borderRadius: "50%", background: "#374151", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", flexShrink: 0 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={d} />
                  </svg>
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
                <Link key={label} href={href}
                  style={{ display: "block", fontSize: 13.5, color: "#6b7280", textDecoration: "none", marginBottom: 12 }}
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
          maxWidth: 1280, margin: "0 auto",
          display: "flex", alignItems: "center",
          justifyContent: "space-between", flexWrap: "wrap", gap: 10,
        }}>
          <p style={{ fontSize: 12.5, color: "#9ca3af", margin: 0 }}>
            © {new Date().getFullYear()} RevStore by Revrica — All rights reserved
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {[
              { name: "Paystack",    icon: "P" },
              { name: "Flutterwave", icon: "F" },
            ].map(({ name, icon }) => (
              <div key={name} style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "5px 12px", background: "#fff",
                borderRadius: 7, border: "1px solid #e8e8e8",
              }}>
                <div style={{ width: 18, height: 18, borderRadius: 4, background: MAROON, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 9, fontWeight: 900, color: "#fff" }}>{icon}</span>
                </div>
                <span style={{ fontSize: 11.5, fontWeight: 800, color: "#374151", letterSpacing: "0.02em" }}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive grid */}
      <style>{`
        .rev-footer-grid {
          display: grid;
          grid-template-columns: 1.7fr 1fr 1fr 1fr;
          gap: 40px;
        }
        @media (max-width: 1024px) { .rev-footer-grid { grid-template-columns: 1.4fr 1fr 1fr !important; } }
        @media (max-width: 768px)  { .rev-footer-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 480px)  { .rev-footer-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </footer>
  );
}
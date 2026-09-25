"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Copy, Mail, MapPin, MessageCircle, Package, Truck } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { RevricaLogo } from "@/components/brand";
import { BANK_ACCOUNT as SHARED_BANK_ACCOUNT, ORDERS_EMAIL, WHATSAPP_NUMBER } from "@/lib/contact";

const SORA = "'Sora','Archivo Variable',ui-sans-serif,system-ui";
const JAKARTA = "'Plus Jakarta Sans','Inter Variable',ui-sans-serif,system-ui";

// Contact and payment details are shared with the shop checkout (src/lib/contact.ts).
const CONTACT_EMAIL = ORDERS_EMAIL;
// This page always shows an account; if the shared one is switched off, say so rather than crash.
const BANK_ACCOUNT = SHARED_BANK_ACCOUNT ?? {
  bankName: "Payment details sent on WhatsApp",
  accountName: "Revrica Technology Ltd",
  accountNumber: "Ask us on WhatsApp",
};

const DEVICES = [
  { id: "orion",  name: "Rev Orion", size: '12"', normalPrice: 350000, preorderPrice: 290000, img: "/devices/rev-laptop.png",
    highlights: ['11.6" HD display','Intel Celeron N4020','4GB RAM · 128GB eMMC','Up to 8h battery','Splash-resistant keys','Windows 11 Home'] },
  { id: "aelia",  name: "Rev Aelia", size: '14"', normalPrice: 400000, preorderPrice: 330000, img: "/devices/rev-laptop.png",
    highlights: ['14.0" HD display','Intel Celeron N4020','4GB RAM · 128GB eMMC','Up to 8h battery','Splash-resistant keys','Windows 11 Home'] },
];
type Device = typeof DEVICES[0];

function fmt(n: number) { return "₦" + n.toLocaleString("en-NG"); }

function DeviceImg({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return (
    <svg className={className} fill="none" viewBox="0 0 560 380">
      <path d="M80 40L480 40L472 280L88 280Z" fill="#2a2a2e"/>
      <path d="M96 56L464 56L458 264L102 264Z" fill="#0a0a0c"/>
      <rect fill="#8a1a1e" height="160" rx="6" width="300" x="130" y="80"/>
      <path d="M40 296L520 296L560 348L0 348Z" fill="#1e1e22"/>
      <rect fill="#FF6B1A" height="4" rx="2" width="40" x="260" y="330"/>
      <text fill="rgba(255,255,255,0.3)" fontFamily="system-ui" fontSize="13" textAnchor="middle" x="280" y="175">{alt}</text>
    </svg>
  );
  return <img alt={alt} className={className} onError={() => setFailed(true)} src={src} />;
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button type="button" onClick={() => { navigator.clipboard.writeText(value).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); }}
      style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(255,255,255,0.08)", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <AnimatePresence mode="wait">
        {copied
          ? <motion.span key="c" initial={{ scale:0.6 }} animate={{ scale:1 }}><CheckCircle2 size={15} color="#34d399"/></motion.span>
          : <motion.span key="n" initial={{ scale:0.6 }} animate={{ scale:1 }}><Copy size={14}/></motion.span>
        }
      </AnimatePresence>
    </button>
  );
}

// ── Step 1: Choose device ─────────────────────────────────────
function StepDevice({ selected, onSelect }: { selected: Device|null; onSelect: (d:Device) => void }) {
  return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.16em", textTransform: "uppercase", margin: "0 0 16px" }}>Step 1 — Choose your laptop</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="device-grid">
        {DEVICES.map(d => {
          const active = selected?.id === d.id;
          const saving = d.normalPrice - d.preorderPrice;
          return (
            <button key={d.id} type="button" onClick={() => onSelect(d)}
              style={{ borderRadius: 20, border: active ? "2px solid #f2760f" : "2px solid #e8e8e8", background: active ? "#fffbf7" : "#fff", padding: 0, cursor: "pointer", textAlign: "left", overflow: "hidden", transition: "all 0.2s", display: "flex", flexDirection: "column" }}>
              <div style={{ position: "relative", padding: "12px 12px 0" }}>
                <div style={{ position: "absolute", top: 10, left: 10, background: "#f2760f", color: "#fff", fontSize: 10, fontWeight: 800, padding: "3px 9px", borderRadius: 6 }}>Save ₦{saving.toLocaleString()}</div>
                <div style={{ background: "#f9f9f9", borderRadius: 10, padding: 16, paddingTop: 28, display: "flex", alignItems: "center", justifyContent: "center", height: 140 }}>
                  <DeviceImg alt={d.name} src={d.img} className="w-full max-w-[160px] object-contain drop-shadow-md" />
                </div>
              </div>
              <div style={{ padding: "14px 16px 18px" }}>
                <p style={{ fontFamily: SORA, fontWeight: 800, fontSize: 16, color: "#111", margin: "0 0 6px" }}>{d.name} <span style={{ color: "#9ca3af", fontWeight: 600, fontSize: 14 }}>{d.size}</span></p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 7, marginBottom: 10 }}>
                  <span style={{ fontFamily: SORA, fontWeight: 900, fontSize: 22, color: "#f2760f" }}>{fmt(d.preorderPrice)}</span>
                  <span style={{ fontSize: 12.5, color: "#d1d5db", textDecoration: "line-through" }}>{fmt(d.normalPrice)}</span>
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
                  {d.highlights.map(h => (
                    <li key={h} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#6b7280" }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#f2760f", flexShrink: 0 }} />{h}
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: 14, height: 40, borderRadius: 100, background: active ? "#f2760f" : "transparent", border: active ? "none" : "1.5px solid #f2760f", color: active ? "#fff" : "#f2760f", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, transition: "all 0.2s" }}>
                  {active ? <><CheckCircle2 size={14}/> Selected</> : "Select this laptop"}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <style>{`.device-grid { @media (max-width: 520px) { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}

// ── Step 2: Buyer details ─────────────────────────────────────
type BuyerInfo = {
  name: string; phone: string; email: string;
  fulfillment: "pickup" | "delivery"; address: string;
};

function StepBuyer({ device, onBack, onNext }: { device: Device; onBack: () => void; onNext: (b:BuyerInfo) => void }) {
  const [form, setForm] = useState<BuyerInfo>({ name:"", phone:"", email:"", fulfillment:"pickup", address:"" });
  const [errors, setErrors] = useState<Partial<BuyerInfo>>({});

  function validate() {
    const e: Partial<BuyerInfo> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.email.includes("@")) e.email = "Enter a valid email";
    if (form.fulfillment === "delivery" && !form.address.trim()) e.address = "Enter your delivery address";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const inp = (field: keyof BuyerInfo, val: string) => setForm(f => ({ ...f, [field]: val }));
  const err = (field: keyof BuyerInfo) => errors[field] ? (
    <p style={{ fontSize: 11.5, color: "#ef4444", margin: "4px 0 0", fontWeight: 600 }}>{errors[field]}</p>
  ) : null;

  const fieldStyle: React.CSSProperties = { width: "100%", height: 46, borderRadius: 10, border: "1.5px solid #e8e8e8", background: "#fafafa", padding: "0 14px", fontSize: 13.5, color: "#111", outline: "none", boxSizing: "border-box", fontFamily: JAKARTA };

  return (
    <div>
      <button type="button" onClick={onBack}
        style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: "#6b7280", background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 20 }}>
        <ArrowLeft size={14}/> Change laptop
      </button>

      {/* Device summary */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, background: "#f9f9f9", borderRadius: 14, padding: "14px 16px", marginBottom: 24, border: "1px solid #ebebeb" }}>
        <div style={{ width: 52, height: 44, background: "#fff", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <DeviceImg alt={device.name} src={device.img} className="h-10 w-auto object-contain" />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: SORA, fontWeight: 700, fontSize: 14, color: "#111", margin: 0 }}>{device.name} {device.size}</p>
          <p style={{ fontSize: 12, color: "#9ca3af", margin: "2px 0 0" }}>Pre-order · you save ₦{(device.normalPrice-device.preorderPrice).toLocaleString()}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontFamily: SORA, fontWeight: 800, fontSize: 20, color: "#f2760f", margin: 0 }}>{fmt(device.preorderPrice)}</p>
        </div>
      </div>

      <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.16em", textTransform: "uppercase", margin: "0 0 16px" }}>Step 2 — Your details</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>Full Name</label>
          <input style={fieldStyle} placeholder="Your full name" value={form.name} onChange={e => inp("name", e.target.value)} />
          {err("name")}
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>Phone Number</label>
          <input style={fieldStyle} placeholder="+234 8XX XXX XXXX" value={form.phone} onChange={e => inp("phone", e.target.value)} />
          {err("phone")}
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>Email Address</label>
          <input style={fieldStyle} type="email" placeholder="you@email.com" value={form.email} onChange={e => inp("email", e.target.value)} />
          {err("email")}
        </div>

        {/* Pickup vs Delivery */}
        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 10 }}>How would you like to receive your device?</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {([["pickup", "Pickup", "Collect from our Lagos office"] , ["delivery", "Delivery", "We deliver to your address"]] as const).map(([val, label, sub]) => (
              <button key={val} type="button" onClick={() => inp("fulfillment", val)}
                style={{ borderRadius: 12, border: form.fulfillment === val ? "2px solid #f2760f" : "2px solid #e8e8e8", background: form.fulfillment === val ? "#fffbf7" : "#fff", padding: "14px 16px", cursor: "pointer", textAlign: "left", transition: "all 0.18s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  {val === "pickup" ? <Package size={15} color={form.fulfillment===val ? "#f2760f" : "#9ca3af"}/> : <Truck size={15} color={form.fulfillment===val ? "#f2760f" : "#9ca3af"}/>}
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: form.fulfillment===val ? "#f2760f" : "#374151" }}>{label}</span>
                </div>
                <p style={{ fontSize: 11.5, color: "#9ca3af", margin: 0 }}>{sub}</p>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {form.fulfillment === "delivery" && (
            <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} exit={{ opacity:0, height:0 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>
                <MapPin size={12} style={{ display:"inline", marginRight:4 }} />Delivery Address
              </label>
              <textarea value={form.address} onChange={e => inp("address", e.target.value)} placeholder="Full address including city and state"
                style={{ width:"100%", minHeight:80, borderRadius:10, border:"1.5px solid #e8e8e8", background:"#fafafa", padding:"12px 14px", fontSize:13.5, color:"#111", outline:"none", resize:"vertical", boxSizing:"border-box", fontFamily:JAKARTA }} />
              {err("address")}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }} type="button"
          onClick={() => { if (validate()) onNext(form); }}
          style={{ width:"100%", height:52, borderRadius:12, background:"#f2760f", border:"none", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", marginTop:4 }}>
          Continue to payment →
        </motion.button>
      </div>
    </div>
  );
}

// ── Step 3: Payment ───────────────────────────────────────────
function StepPayment({ device, buyer, onBack }: { device:Device; buyer:BuyerInfo; onBack:() => void }) {
  const saving = device.normalPrice - device.preorderPrice;
  const whatsappMsg = encodeURIComponent(
    `Hi Revrica! I've made a pre-order payment.\n\nDevice: ${device.name} ${device.size}\nAmount: ${fmt(device.preorderPrice)}\nName: ${buyer.name}\nPhone: ${buyer.phone}\nEmail: ${buyer.email}\nFulfillment: ${buyer.fulfillment === "pickup" ? "Pickup" : `Delivery to: ${buyer.address}`}\n\nBank paid to: ${BANK_ACCOUNT.bankName} — ${BANK_ACCOUNT.accountName} — ${BANK_ACCOUNT.accountNumber}\n\nPlease confirm my order. Thank you!`
  );
  const emailBody = encodeURIComponent(
    `Hi Revrica,\n\nI have made a pre-order payment.\n\nDevice: ${device.name} ${device.size}\nAmount: ${fmt(device.preorderPrice)}\n\nBuyer Info:\nName: ${buyer.name}\nPhone: ${buyer.phone}\nFulfillment: ${buyer.fulfillment === "pickup" ? "Pickup" : `Delivery to: ${buyer.address}`}\n\nBank paid to:\n${BANK_ACCOUNT.bankName}\n${BANK_ACCOUNT.accountName}\n${BANK_ACCOUNT.accountNumber}\n\nPlease confirm. Thank you.`
  );

  return (
    <div>
      <button type="button" onClick={onBack}
        style={{ display:"inline-flex", alignItems:"center", gap:7, fontSize:13, fontWeight:700, color:"#6b7280", background:"none", border:"none", cursor:"pointer", padding:0, marginBottom:20 }}>
        <ArrowLeft size={14}/> Edit details
      </button>

      {/* Order + buyer summary */}
      <div style={{ background:"#f9f9f9", borderRadius:14, padding:"16px", border:"1px solid #ebebeb", marginBottom:24 }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ width:52, height:44, background:"#fff", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <DeviceImg alt={device.name} src={device.img} className="h-10 w-auto object-contain" />
          </div>
          <div style={{ flex:1 }}>
            <p style={{ fontFamily:SORA, fontWeight:700, fontSize:14, color:"#111", margin:0 }}>{device.name} {device.size}</p>
            <p style={{ fontSize:12, color:"#9ca3af", margin:"2px 0 0" }}>{buyer.fulfillment === "pickup" ? "📦 Pickup" : `🚚 Delivery to ${buyer.address.split(",")[0]}`} · {buyer.name}</p>
          </div>
          <div>
            <p style={{ fontFamily:SORA, fontWeight:800, fontSize:20, color:"#f2760f", margin:0 }}>{fmt(device.preorderPrice)}</p>
            <p style={{ fontSize:11, color:"#9ca3af", margin:"2px 0 0", textAlign:"right" }}>Save ₦{saving.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Bank account card */}
      <div style={{ borderRadius:20, overflow:"hidden", background:"radial-gradient(130% 90% at 50% 0%,#7a1a1e 0%,#4a0e10 60%,#2e0608 100%)" }}>
        <div style={{ padding:"24px 24px 0" }}>
          <p style={{ fontSize:10.5, fontWeight:700, color:"rgba(255,255,255,0.45)", letterSpacing:"0.16em", textTransform:"uppercase", margin:"0 0 8px" }}>Step 3 — Make your transfer</p>
          <h3 style={{ fontFamily:SORA, fontWeight:800, fontSize:20, color:"#fff", margin:"0 0 6px" }}>Transfer to this account</h3>
          <p style={{ fontSize:13, color:"rgba(255,255,255,0.5)", margin:"0 0 20px" }}>
            Send exactly <span style={{ color:"#fff", fontWeight:700 }}>{fmt(device.preorderPrice)}</span> to lock in your order.
          </p>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {[
              { label:"Bank",           value:BANK_ACCOUNT.bankName },
              { label:"Account Name",   value:BANK_ACCOUNT.accountName },
              { label:"Account Number", value:BANK_ACCOUNT.accountNumber },
              { label:"Amount",         value:fmt(device.preorderPrice) },
            ].map(({ label, value }) => (
              <div key={label} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, borderRadius:12, border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.06)", padding:"12px 14px" }}>
                <div>
                  <p style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.38)", textTransform:"uppercase", letterSpacing:"0.1em", margin:"0 0 3px" }}>{label}</p>
                  <p style={{ fontFamily:SORA, fontWeight:700, fontSize:15, color:"#fff", margin:0 }}>{value}</p>
                </div>
                <CopyButton value={value} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ margin:"20px 24px", borderTop:"1px solid rgba(255,255,255,0.08)" }} />

        <div style={{ padding:"0 24px 24px" }}>
          <p style={{ fontSize:10.5, fontWeight:700, color:"rgba(255,255,255,0.45)", letterSpacing:"0.16em", textTransform:"uppercase", margin:"0 0 8px" }}>Step 4 — Confirm your payment</p>
          <h3 style={{ fontFamily:SORA, fontWeight:800, fontSize:18, color:"#fff", margin:"0 0 6px" }}>Let us know you've paid</h3>
          <p style={{ fontSize:13, color:"rgba(255,255,255,0.5)", margin:"0 0 18px" }}>
            A pre-filled message is ready — just hit send. We'll confirm within 24 hours.
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`} target="_blank" rel="noreferrer"
              style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:9, height:52, borderRadius:14, background:"#25D366", color:"#fff", fontSize:13.5, fontWeight:700, textDecoration:"none", transition:"filter 0.2s" }}>
              <MessageCircle size={18}/> WhatsApp
            </a>
            <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Pre-order — ${device.name} ${device.size}`)}&body=${emailBody}`}
              style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:9, height:52, borderRadius:14, border:"1.5px solid rgba(255,255,255,0.15)", background:"rgba(255,255,255,0.06)", color:"#fff", fontSize:13.5, fontWeight:700, textDecoration:"none" }}>
              <Mail size={16}/> Email us
            </a>
          </div>
          <p style={{ marginTop:14, textAlign:"center", fontSize:11.5, color:"rgba(255,255,255,0.28)" }}>
            We'll confirm your order within 24 hours of receiving payment.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────
function PreOrderInner() {
  const searchParams = useSearchParams();
  const preselect = searchParams?.get("device");

  const [selectedDevice, setSelectedDevice] = useState<Device|null>(
    preselect ? DEVICES.find(d => d.id === preselect) ?? null : null
  );
  const [buyerInfo, setBuyerInfo] = useState<BuyerInfo|null>(null);
  const step = !selectedDevice ? 0 : !buyerInfo ? 1 : 2;

  const STEP_LABELS = ["Choose device","Your details","Payment"];

  return (
    <div style={{ fontFamily:JAKARTA, background:"#f5f5f5", minHeight:"100vh" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Sora:wght@700;800&display=swap');`}</style>

      {/* Header */}
      <header style={{ background:"#fff", borderBottom:"1px solid #e8e8e8", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ maxWidth:860, margin:"0 auto", padding:"0 20px", display:"flex", alignItems:"center", height:60, gap:16 }}>
          <RevricaLogo />
          <div style={{ display:"flex", alignItems:"center", gap:6, marginLeft:"auto" }}>
            <Link href="/" style={{ fontSize:13, fontWeight:600, color:"#6b7280", textDecoration:"none", display:"flex", alignItems:"center", gap:6 }}>
              <ArrowLeft size={13}/> Back to store
            </Link>
          </div>
        </div>
      </header>

      <div style={{ maxWidth:860, margin:"0 auto", padding:"32px 20px 60px" }}>
        {/* Hero copy */}
        <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}>
          <div style={{ display:"inline-block", background:"rgba(242,118,15,0.1)", border:"1px solid rgba(242,118,15,0.2)", borderRadius:100, padding:"5px 14px", marginBottom:14 }}>
            <span style={{ fontSize:11, fontWeight:700, color:"#f2760f", letterSpacing:"0.06em" }}>Limited Pre-order</span>
          </div>
          <h1 style={{ fontFamily:SORA, fontWeight:800, fontSize:"clamp(26px,4vw,40px)", color:"#111", margin:"0 0 10px", letterSpacing:"-0.025em", lineHeight:1.08 }}>
            Pre-order your Rev laptop.<br/>
            <span style={{ color:"#f2760f" }}>Lock in the deal today.</span>
          </h1>
          <p style={{ fontSize:14.5, color:"#6b7280", margin:"0 0 28px", lineHeight:1.65, maxWidth:520 }}>
            Secure your device at the pre-order price before stock arrives. Pay now — receive yours first.
          </p>
        </motion.div>

        {/* Step indicator */}
        <div style={{ display:"flex", alignItems:"center", gap:0, marginBottom:28, background:"#fff", borderRadius:14, padding:"14px 20px", border:"1px solid #ebebeb" }}>
          {STEP_LABELS.map((label, i) => (
            <div key={label} style={{ display:"flex", alignItems:"center", flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:26, height:26, borderRadius:"50%", background:i < step ? "#22c55e" : i===step ? "#f2760f" : "#e8e8e8", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  {i < step
                    ? <CheckCircle2 size={14} color="#fff"/>
                    : <span style={{ fontSize:11, fontWeight:800, color:i===step?"#fff":"#9ca3af" }}>{i+1}</span>
                  }
                </div>
                <span style={{ fontSize:12.5, fontWeight:i===step?700:500, color:i===step?"#111":"#9ca3af" }}>{label}</span>
              </div>
              {i < STEP_LABELS.length-1 && <div style={{ flex:1, height:1.5, background:"#e8e8e8", margin:"0 12px" }}/>}
            </div>
          ))}
        </div>

        {/* Card */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.45, delay:0.1 }}
          style={{ background:"#fff", borderRadius:22, border:"1px solid #ebebeb", padding:"28px", boxShadow:"0 8px 40px rgba(0,0,0,0.06)" }}>
          <AnimatePresence mode="wait">
            {step===0 && (
              <motion.div key="s0" initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-16 }} transition={{ duration:0.22 }}>
                <StepDevice selected={selectedDevice} onSelect={d => { setSelectedDevice(d); setTimeout(() => document.getElementById("po-card")?.scrollIntoView({ behavior:"smooth", block:"start" }), 60); }} />
              </motion.div>
            )}
            {step===1 && selectedDevice && (
              <motion.div key="s1" initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-16 }} transition={{ duration:0.22 }}>
                <StepBuyer device={selectedDevice} onBack={() => setSelectedDevice(null)} onNext={info => { setBuyerInfo(info); setTimeout(() => document.getElementById("po-card")?.scrollIntoView({ behavior:"smooth", block:"start" }), 60); }} />
              </motion.div>
            )}
            {step===2 && selectedDevice && buyerInfo && (
              <motion.div key="s2" initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-16 }} transition={{ duration:0.22 }}>
                <StepPayment device={selectedDevice} buyer={buyerInfo} onBack={() => setBuyerInfo(null)} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <p style={{ marginTop:16, textAlign:"center", fontSize:11.5, color:"#9ca3af" }}>
          Pre-order pricing is limited. Prices may change without notice. By pre-ordering you agree to Revrica's terms of sale.
        </p>
      </div>
    </div>
  );
}

export default function PreOrderPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#f5f5f5" }} />}>
      <PreOrderInner />
    </Suspense>
  );
}
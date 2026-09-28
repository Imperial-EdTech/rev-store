"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Trash2, UserCircle, Plus, Link } from "lucide-react";
import { RevLearnShell, useActiveProfile } from "@/components/revlearn/shell";
import { getAvatarColor, getInitials } from "@/lib/revlearn/utils";
import {
  getProfiles, upsertProfile, deleteProfile,
  setActiveProfileId, generateId,
  type StoredProfile,
} from "@/lib/revlearn/profiles";

const D = '"Archivo Variable", ui-sans-serif, system-ui';

// ── Subject list with icons ───────────────────────────────────
const SUBJECTS = [
  { value: "English",              icon: "📖" },
  { value: "Mathematics",          icon: "🔢" },
  { value: "Science",              icon: "🔬" },
  { value: "Social Studies",       icon: "🌍" },
  { value: "Civic Education",      icon: "🏛️" },
  { value: "Agricultural Science", icon: "🌱" },
  { value: "ICT",                  icon: "💻" },
  { value: "French",               icon: "🇫🇷" },
  { value: "Yoruba",               icon: "🗣️" },
  { value: "Igbo",                 icon: "🗣️" },
  { value: "Hausa",                icon: "🗣️" },
  { value: "Business Studies",     icon: "💼" },
  { value: "Fine Art",             icon: "🎨" },
  { value: "Music",                icon: "🎵" },
  { value: "Physical Education",   icon: "⚽" },
  { value: "Other",                icon: "📚" },
];

function Avatar({ name, color, size = 36 }: { name: string; color: string; size?: number }) {
  return (
    <div style={{ width: size, height: size, background: color, fontSize: size * 0.38, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, flexShrink: 0, letterSpacing: "-.02em", fontFamily: D }}>
      {getInitials(name)}
    </div>
  );
}

function ProfileContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const isNew        = searchParams.get("new") === "1";
  const { active, refresh } = useActiveProfile();

  const [name, setName]         = useState("");
  const [school, setSchool]     = useState("");
  const [subject, setSubject]   = useState("Mathematics");
  const [saved, setSaved]       = useState(false);
  const [profiles, setProfiles] = useState<StoredProfile[]>([]);

  useEffect(() => {
    setProfiles(getProfiles());
    if (!isNew && active) {
      setName(active.name);
      setSchool(active.school);
      setSubject(active.subject);
    }
  }, [active, isNew]);

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const id = (!isNew && active?.id) ? active.id : generateId();
    const profile: StoredProfile = {
      id, name: name.trim(), school: school.trim(), subject,
      avatarColor: getAvatarColor(name.trim()),
      joinedAt: active?.joinedAt ?? new Date().toISOString(),
    };
    upsertProfile(profile);
    setActiveProfileId(id);
    refresh();
    setSaved(true);
    setTimeout(() => { setSaved(false); router.push("/revlearn"); }, 1400);
  }

  function handleDelete(id: string) {
    if (!confirm("Remove this profile?")) return;
    deleteProfile(id);
    setProfiles(getProfiles());
    refresh();
  }

  function handleSwitch(p: StoredProfile) {
    setActiveProfileId(p.id);
    setName(p.name); setSchool(p.school); setSubject(p.subject);
    refresh();
    setProfiles(getProfiles());
  }

  const avatarColor    = name ? getAvatarColor(name) : "#e85d04";
  const selectedSubject = SUBJECTS.find(s => s.value === subject);

  const inputStyle = {
    width: "100%", height: 44, padding: "0 14px",
    background: "var(--rl-bg-subtle)", border: "1.5px solid var(--rl-line)",
    borderRadius: 10, color: "var(--rl-ink)", fontSize: ".875rem",
    outline: "none", fontFamily: "inherit", boxSizing: "border-box" as const,
    transition: "border-color .15s, background .15s",
  };

  return (
    <RevLearnShell>
      {/* Hero */}
      <div className="rl-page-hero">
        <p className="rl-page-kicker">{isNew ? "New profile" : "Profile"}</p>
        <h1 className="rl-page-title">
          {isNew ? "Create a new profile" : active ? "Your profile" : "Set up your profile"}
        </h1>
        <p className="rl-page-sub">Profiles are saved on this device. Switch between them anytime.</p>
      </div>

      <div style={{ padding: "1.75rem 2rem 4rem", display: "flex", flexDirection: "column", gap: "1.75rem" }} className="rl-profile-layout">
        <style>{`
          @media (min-width: 860px) {
            .rl-profile-layout { flex-direction: row !important; align-items: flex-start; }
            .rl-profile-saved-col { width: 300px; flex-shrink: 0; }
            .rl-profile-form-col { flex: 1; min-width: 0; }
          }
          @media (max-width: 600px) {
            .rl-profile-layout { padding: 1.25rem 1rem 4rem !important; }
          }
        `}</style>

        {/* ── Saved profiles ── */}
        {profiles.length > 0 && (
          <div className="rl-profile-saved-col">
            <p style={{ margin: "0 0 .875rem", fontSize: ".68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--rl-body)" }}>Saved profiles</p>
            <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
              {profiles.map(p => {
                const isActive = p.id === active?.id;
                const pSubject = SUBJECTS.find(s => s.value === p.subject);
                return (
                  <div key={p.id} style={{ display: "flex", alignItems: "center", gap: ".5rem", background: "var(--rl-bg)", border: `1.5px solid ${isActive ? "var(--rl-maroon)" : "var(--rl-line)"}`, borderRadius: 14, overflow: "hidden", boxShadow: "var(--rl-shadow-xs)", transition: "border-color .15s" }}>
                    <button onClick={() => handleSwitch(p)}
                      style={{ display: "flex", alignItems: "center", gap: ".875rem", flex: 1, padding: ".875rem 1rem", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit", transition: "background .15s" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "var(--rl-bg-subtle)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <Avatar name={p.name} color={getAvatarColor(p.name)} size={42} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: "0 0 .15rem", fontSize: ".9rem", fontWeight: 700, color: "var(--rl-ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                        <p style={{ margin: 0, fontSize: ".75rem", color: "var(--rl-body)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {pSubject?.icon} {p.subject} · {p.school || "No school set"}
                        </p>
                      </div>
                      {isActive && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px", background: "var(--rl-maroon-light)", color: "var(--rl-maroon)", borderRadius: "999px", fontSize: ".66rem", fontWeight: 700, flexShrink: 0 }}>
                          <Check size={11} /> Active
                        </span>
                      )}
                    </button>
                    {profiles.length > 1 && (
                      <button onClick={() => handleDelete(p.id)}
                        style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, border: "1px solid transparent", borderRadius: 8, background: "transparent", color: "var(--rl-body)", cursor: "pointer", marginRight: ".5rem", flexShrink: 0, transition: "all .15s" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "#ef4444"; e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.background = "#fef2f2"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.color = "var(--rl-body)"; e.currentTarget.style.background = "transparent"; }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                );
              })}
              <Link href="/revlearn/profile?new=1"
                style={{ display: "flex", alignItems: "center", gap: ".75rem", padding: ".75rem 1rem", border: "1.5px dashed var(--rl-line-strong)", borderRadius: 14, color: "var(--rl-maroon)", textDecoration: "none", fontSize: ".84rem", fontWeight: 600, transition: "border-color .15s,background .15s" }}
                onMouseEnter={e => { const target = e.currentTarget as unknown as HTMLElement; target.style.borderColor = "var(--rl-maroon)"; target.style.background = "var(--rl-maroon-light)"; }}
                onMouseLeave={e => { const target = e.currentTarget as unknown as HTMLElement; target.style.borderColor = "var(--rl-line-strong)"; target.style.background = "transparent"; }}
              >
                <Plus size={16} /> Add new profile
              </Link>
            </div>
          </div>
        )}

        {/* ── Form ── */}
        <div className="rl-profile-form-col">
          <div style={{ background: "var(--rl-bg)", border: "1px solid var(--rl-line)", borderRadius: 20, padding: "1.75rem", boxShadow: "var(--rl-shadow-xs)" }}>

            {/* Avatar preview */}
            <div style={{ display: "flex", alignItems: "center", gap: "1.125rem", marginBottom: "1.5rem", padding: "1.125rem 1.25rem", background: "var(--rl-bg-subtle)", borderRadius: 14 }}>
              <Avatar name={name || "?"} color={avatarColor} size={64} />
              <div>
                <p style={{ margin: "0 0 .2rem", fontFamily: D, fontSize: "1.05rem", fontWeight: 800, color: "var(--rl-ink)" }}>{name || "Your name"}</p>
                <p style={{ margin: "0 0 .2rem", fontSize: ".84rem", color: "var(--rl-body)" }}>
                  {selectedSubject?.icon} {subject} {school ? `· ${school}` : ""}
                </p>
                <p style={{ margin: 0, fontSize: ".68rem", color: "var(--rl-body)", opacity: .65 }}>Avatar generated from your name</p>
              </div>
            </div>

            <form onSubmit={save} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Name */}
              <div>
                <label style={{ display: "block", marginBottom: ".375rem", fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--rl-body)" }}>
                  Full name *
                </label>
                <input
                  style={inputStyle}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Amaka Okonkwo"
                  required
                  onFocus={e => { e.target.style.borderColor = "var(--rl-maroon)"; e.target.style.background = "var(--rl-bg)"; }}
                  onBlur={e => { e.target.style.borderColor = "var(--rl-line)"; e.target.style.background = "var(--rl-bg-subtle)"; }}
                />
              </div>

              {/* School */}
              <div>
                <label style={{ display: "block", marginBottom: ".375rem", fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--rl-body)" }}>
                  School or organisation
                </label>
                <input
                  style={inputStyle}
                  value={school}
                  onChange={e => setSchool(e.target.value)}
                  placeholder="e.g. Lagos State Secondary School"
                  onFocus={e => { e.target.style.borderColor = "var(--rl-maroon)"; e.target.style.background = "var(--rl-bg)"; }}
                  onBlur={e => { e.target.style.borderColor = "var(--rl-line)"; e.target.style.background = "var(--rl-bg-subtle)"; }}
                />
              </div>

              {/* Subject — icon grid */}
              <div>
                <label style={{ display: "block", marginBottom: ".625rem", fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--rl-body)" }}>
                  Subject you teach
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: ".5rem" }}>
                  {SUBJECTS.map(s => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setSubject(s.value)}
                      style={{
                        display: "flex", alignItems: "center", gap: ".5rem", padding: ".625rem .875rem",
                        border: `1.5px solid ${subject === s.value ? "var(--rl-maroon)" : "var(--rl-line)"}`,
                        borderRadius: 10, background: subject === s.value ? "var(--rl-maroon-light)" : "var(--rl-bg-subtle)",
                        color: subject === s.value ? "var(--rl-maroon)" : "var(--rl-ink)",
                        fontSize: ".8rem", fontWeight: subject === s.value ? 700 : 400,
                        cursor: "pointer", fontFamily: "inherit", transition: "all .15s", textAlign: "left" as const,
                      }}
                    >
                      <span style={{ fontSize: "1rem", lineHeight: 1, flexShrink: 0 }}>{s.icon}</span>
                      {s.value}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!name.trim() || saved}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  height: 48, background: saved ? "var(--rl-teal)" : "var(--rl-maroon)", color: "#fff",
                  border: "none", borderRadius: "999px", fontFamily: D, fontSize: ".9rem", fontWeight: 700,
                  cursor: name.trim() ? "pointer" : "not-allowed", marginTop: ".25rem",
                  opacity: name.trim() ? 1 : .5, transition: "background .2s",
                }}
              >
                {saved ? <><Check size={18} /> Saved! Returning…</> : isNew ? "Create profile" : "Save changes"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </RevLearnShell>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="rl-state-center"><UserCircle size={32} /></div>}>
      <ProfileContent />
    </Suspense>
  );
}

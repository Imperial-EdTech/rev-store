"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { RevLearnShell } from "@/components/revlearn/shell";
import { useProfile } from "@/lib/revlearn-hooks";
import { getAvatarColor, getInitials } from "@/lib/revlearn-utils";

const SUBJECTS = [
  "English", "Mathematics", "Science", "Social Studies", "Civic Education",
  "Agricultural Science", "ICT", "French", "Yoruba", "Igbo", "Hausa",
  "Business Studies", "Fine Art", "Music", "Physical Education", "Other"
];

function Avatar({ name, color, size = 64 }: { name: string; color: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, background: color, fontSize: size * 0.36,
      borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontWeight: 700, letterSpacing: "-.02em", flexShrink: 0,
    }}>
      {name ? getInitials(name) : "?"}
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { profile, update } = useProfile();
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [subject, setSubject] = useState("Mathematics");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setSchool(profile.school);
      setSubject(profile.subject);
    }
  }, [profile]);

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    update({
      name: name.trim(),
      school: school.trim(),
      subject,
      avatarColor: getAvatarColor(name.trim()),
      joinedAt: profile?.joinedAt ?? new Date().toISOString(),
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      router.push("/revlearn/community");
    }, 1200);
  }

  const avatarColor = name ? getAvatarColor(name) : "#e85d04";

  return (
    <RevLearnShell>
      <div className="rl-page">
        <div className="rl-page-hero">
          <p className="rl-page-kicker">{profile ? "Edit profile" : "Get started"}</p>
          <h1 className="rl-page-title">{profile ? "Edit your profile" : "Set up your profile"}</h1>
          <p className="rl-page-sub">
            Your profile is saved on this device. It lets you post and reply in the community.
          </p>
        </div>

        <div style={{ maxWidth: 520, padding: "2rem 1.5rem 4rem" }}>
          {/* Avatar preview */}
          <div style={{
            display: "flex", alignItems: "center", gap: "1.25rem",
            marginBottom: "2rem", padding: "1.25rem",
            background: "var(--rl-bg-subtle)", border: "1px solid var(--rl-line)",
            borderRadius: "var(--rl-radius-lg)"
          }}>
            <Avatar name={name || "?"} color={avatarColor} size={64} />
            <div>
              <p style={{ fontWeight: 700, fontSize: "1rem", color: "var(--rl-ink)", margin: "0 0 .2rem" }}>
                {name || "Your name"}
              </p>
              <p style={{ fontSize: ".82rem", color: "var(--rl-body)", margin: 0 }}>
                {school || "Your school"}
                {subject && ` · ${subject}`}
              </p>
              <p style={{ fontSize: ".7rem", color: "var(--rl-body)", margin: ".25rem 0 0", opacity: .65 }}>
                Avatar is generated automatically from your name
              </p>
            </div>
          </div>

          <form onSubmit={save} style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}>
            <div className="rl-admin-field">
              <span className="rl-admin-label">Full name *</span>
              <input
                className="rl-admin-input"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Amaka Okonkwo"
                required
              />
            </div>
            <div className="rl-admin-field">
              <span className="rl-admin-label">School or organisation</span>
              <input
                className="rl-admin-input"
                value={school}
                onChange={e => setSchool(e.target.value)}
                placeholder="e.g. Lagos State Secondary School"
              />
            </div>
            <div className="rl-admin-field">
              <span className="rl-admin-label">Subject you teach</span>
              <select
                className="rl-admin-input"
                value={subject}
                onChange={e => setSubject(e.target.value)}
              >
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <button
              type="submit"
              className="rl-admin-save"
              style={{ height: 46, justifyContent: "center", fontSize: ".9rem", marginTop: ".5rem" }}
              disabled={!name.trim()}
            >
              {saved ? <><Check size={16} /> Saved!</> : profile ? "Save changes" : "Create profile"}
            </button>
          </form>
        </div>
      </div>
    </RevLearnShell>
  );
}
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Trash2, UserCircle } from "lucide-react";
import { RevLearnShell, useActiveProfile, Avatar } from "@/components/revlearn/shell";
import { getAvatarColor } from "@/lib/revlearn-utils";
import {
  getProfiles, upsertProfile, deleteProfile,
  setActiveProfileId, generateId,
  type StoredProfile,
} from "@/lib/revlearn-profiles";

const SUBJECTS = [
  "English", "Mathematics", "Science", "Social Studies", "Civic Education",
  "Agricultural Science", "ICT", "French", "Yoruba", "Igbo", "Hausa",
  "Business Studies", "Fine Art", "Music", "Physical Education", "Other",
];

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isNew = searchParams.get("new") === "1";
  const { active, refresh } = useActiveProfile();

  const [name, setName]       = useState("");
  const [school, setSchool]   = useState("");
  const [subject, setSubject] = useState("Mathematics");
  const [saved, setSaved]     = useState(false);
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
    setTimeout(() => { setSaved(false); router.push("/revlearn"); }, 1200);
  }

  function handleDelete(id: string) {
    if (!confirm("Remove this profile?")) return;
    deleteProfile(id);
    setProfiles(getProfiles());
    refresh();
  }

  function handleSwitch(p: StoredProfile) {
    setActiveProfileId(p.id);
    setName(p.name);
    setSchool(p.school);
    setSubject(p.subject);
    refresh();
    setProfiles(getProfiles());
  }

  const avatarColor = name ? getAvatarColor(name) : "#e85d04";

  return (
    <RevLearnShell>
      <div className="rl-page">
        <div className="rl-page-hero">
          <p className="rl-page-kicker">{isNew ? "Add profile" : "Your profile"}</p>
          <h1 className="rl-page-title">
            {isNew ? "Create a new profile" : active ? "Edit your profile" : "Set up your profile"}
          </h1>
          <p className="rl-page-sub">Profiles are saved on this device. Switch between them anytime.</p>
        </div>

        <div className="rl-profile-page-body">
          {/* Existing profiles */}
          {profiles.length > 0 && (
            <div className="rl-profile-existing">
              <p className="rl-profile-existing-label">Saved profiles</p>
              <div className="rl-profile-existing-list">
                {profiles.map(p => (
                  <div key={p.id} className={`rl-profile-existing-item${p.id === active?.id ? " rl-profile-existing-item--active" : ""}`}>
                    <button className="rl-profile-existing-btn" onClick={() => handleSwitch(p)}>
                      <Avatar name={p.name} color={getAvatarColor(p.name)} size={38} />
                      <div>
                        <p className="rl-profile-existing-name">{p.name}</p>
                        <p className="rl-profile-existing-school">{p.school} · {p.subject}</p>
                      </div>
                      {p.id === active?.id && (
                        <span className="rl-profile-active-badge"><Check size={12} /> Active</span>
                      )}
                    </button>
                    {profiles.length > 1 && (
                      <button className="rl-admin-icon-btn rl-admin-icon-btn--danger" onClick={() => handleDelete(p.id)}>
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form */}
          <div className="rl-profile-form-wrap">
            <h2 className="rl-profile-form-title">{isNew ? "New profile" : "Edit profile"}</h2>
            <div className="rl-profile-avatar-preview">
              <Avatar name={name || "?"} color={avatarColor} size={64} />
              <div>
                <p className="rl-profile-preview-name">{name || "Your name"}</p>
                <p className="rl-profile-preview-sub">{school || "Your school"}{subject ? ` · ${subject}` : ""}</p>
                <p className="rl-profile-preview-hint">Avatar generated from your name</p>
              </div>
            </div>
            <form onSubmit={save} className="rl-profile-form">
              <div className="rl-admin-field">
                <span className="rl-admin-label">Full name *</span>
                <input className="rl-admin-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Amaka Okonkwo" required />
              </div>
              <div className="rl-admin-field">
                <span className="rl-admin-label">School or organisation</span>
                <input className="rl-admin-input" value={school} onChange={e => setSchool(e.target.value)} placeholder="e.g. Lagos State Secondary School" />
              </div>
              <div className="rl-admin-field">
                <span className="rl-admin-label">Subject you teach</span>
                <select className="rl-admin-input" value={subject} onChange={e => setSubject(e.target.value)}>
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <button
                type="submit"
                className="rl-admin-save"
                style={{ height: 46, justifyContent: "center", fontSize: ".9rem", marginTop: ".5rem" }}
                disabled={!name.trim()}
              >
                {saved ? <><Check size={16} /> Saved!</> : isNew ? "Create profile" : "Save changes"}
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
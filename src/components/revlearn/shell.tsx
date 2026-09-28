"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext, useCallback, useContext,
  useEffect, useRef, useState,
} from "react";
import {
  BookOpen, Wrench, FileText, Users, Home,
  Moon, Sun, ChevronDown, Plus, LogOut,
  Bell, Check, UserCircle,
} from "lucide-react";
import {
  getProfiles, getActiveProfile, setActiveProfileId,
  upsertProfile, deleteProfile, generateId,
  type StoredProfile,
} from "@/lib/revlearn/profiles";
import { getAvatarColor, getInitials } from "@/lib/revlearn/utils";

// ── Theme ──────────────────────────────────────────────────────
type Theme = "light" | "dark";
const ThemeCtx = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "light", toggle: () => {},
});
export const useRLTheme = () => useContext(ThemeCtx);

// ── Profile context ────────────────────────────────────────────
type ProfileCtxType = {
  active: StoredProfile | null;
  profiles: StoredProfile[];
  switchProfile: (id: string) => void;
  refresh: () => void;
};
const ProfileCtx = createContext<ProfileCtxType>({
  active: null, profiles: [], switchProfile: () => {}, refresh: () => {},
});
export const useActiveProfile = () => useContext(ProfileCtx);

// ── Providers ──────────────────────────────────────────────────
export function RevLearnProviders({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState<StoredProfile | null>(null);
  const [profiles, setProfiles] = useState<StoredProfile[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("rl-theme") as Theme | null;
    setTheme(stored ?? "light");
    setActive(getActiveProfile());
    setProfiles(getProfiles());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-rl", theme);
    localStorage.setItem("rl-theme", theme);
  }, [theme, mounted]);

  useEffect(() => {
    if ("serviceWorker" in navigator)
      navigator.serviceWorker
        .register("/revlearn-sw.js", { scope: "/revlearn" })
        .catch(() => {});
  }, []);

  const toggle = useCallback(
    () => setTheme(t => t === "light" ? "dark" : "light"),
    []
  );

  const refresh = useCallback(() => {
    setActive(getActiveProfile());
    setProfiles(getProfiles());
  }, []);

  const switchProfile = useCallback((id: string) => {
    setActiveProfileId(id);
    refresh();
  }, [refresh]);

  if (!mounted) return <div style={{ visibility: "hidden" }}>{children}</div>;

  return (
    <ThemeCtx.Provider value={{ theme, toggle }}>
      <ProfileCtx.Provider value={{ active, profiles, switchProfile, refresh }}>
        <div className="rl-app" data-rl={theme}>{children}</div>
      </ProfileCtx.Provider>
    </ThemeCtx.Provider>
  );
}

// ── Avatar ─────────────────────────────────────────────────────
export function Avatar({ name, color, size = 32 }: { name: string; color: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, background: color,
      fontSize: Math.round(size * 0.38), borderRadius: "50%",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontWeight: 700, flexShrink: 0,
      letterSpacing: "-.02em", userSelect: "none",
    }}>
      {getInitials(name)}
    </div>
  );
}

// ── Nav ────────────────────────────────────────────────────────
const NAV = [
  { href: "/revlearn",           label: "Dashboard",  Icon: Home,     exact: true },
  { href: "/revlearn/courses",   label: "Courses",    Icon: BookOpen, exact: false },
  { href: "/revlearn/tools",     label: "Tools",      Icon: Wrench,   exact: false },
  { href: "/revlearn/resources", label: "Resources",  Icon: FileText, exact: false },
  { href: "/revlearn/community", label: "Community",  Icon: Users,    exact: false },
];

function NavLink({ href, label, Icon, exact }: { href: string; label: string; Icon: React.ElementType; exact: boolean }) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname.startsWith(href);
  return (
    <Link href={href} className={`rl-nav-link${active ? " rl-nav-link--active" : ""}`}>
      <span className="rl-nav-icon"><Icon size={18} /></span>
      <span className="rl-nav-label">{label}</span>
    </Link>
  );
}

function BottomLink({ href, label, Icon, exact }: { href: string; label: string; Icon: React.ElementType; exact: boolean }) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname.startsWith(href);
  return (
    <Link href={href} className={`rl-bottom-link${active ? " rl-bottom-link--active" : ""}`}>
      <Icon size={20} /><span>{label}</span>
    </Link>
  );
}

// ── Profile switcher ───────────────────────────────────────────
function ProfileSwitcher() {
  const { active, profiles, switchProfile, refresh } = useActiveProfile();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    deleteProfile(id);
    refresh();
  }

  if (!active) {
    return (
      <Link href="/revlearn/profile" className="rl-header-profile-btn">
        <UserCircle size={20} /><span style={{ fontSize: ".82rem", fontWeight: 600 }}>Set up profile</span>
      </Link>
    );
  }

  return (
    <div className="rl-profile-switcher" ref={ref}>
      <button className="rl-header-profile-btn" onClick={() => setOpen(o => !o)}>
        <Avatar name={active.name} color={getAvatarColor(active.name)} size={32} />
        <div className="rl-header-profile-text">
          <span className="rl-header-profile-name">{active.name}</span>
          <span className="rl-header-profile-sub">{active.subject}</span>
        </div>
        <ChevronDown size={15} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s", color: "var(--rl-body)" }} />
      </button>

      {open && (
        <div className="rl-profile-dropdown">
          <p className="rl-profile-dropdown-label">Switch profile</p>
          {profiles.map(p => (
            <div key={p.id} className="rl-profile-dropdown-item">
              <button
                className={`rl-profile-dropdown-btn${p.id === active.id ? " rl-profile-dropdown-btn--active" : ""}`}
                onClick={() => { switchProfile(p.id); setOpen(false); }}
              >
                <Avatar name={p.name} color={getAvatarColor(p.name)} size={30} />
                <div className="rl-profile-dropdown-info">
                  <span className="rl-profile-dropdown-name">{p.name}</span>
                  <span className="rl-profile-dropdown-sub">{p.school}</span>
                </div>
                {p.id === active.id && <Check size={14} className="rl-profile-active-check" />}
              </button>
              {profiles.length > 1 && (
                <button className="rl-profile-delete-btn" onClick={e => handleDelete(p.id, e)} title="Remove">
                  <LogOut size={13} />
                </button>
              )}
            </div>
          ))}
          <button className="rl-profile-add-btn" onClick={() => { setOpen(false); router.push("/revlearn/profile?new=1"); }}>
            <Plus size={14} /> Add another profile
          </button>
          <div className="rl-profile-dropdown-divider" />
          <Link href="/revlearn/profile" className="rl-profile-edit-link" onClick={() => setOpen(false)}>
            Edit current profile
          </Link>
        </div>
      )}
    </div>
  );
}

// ── Sidebar ────────────────────────────────────────────────────
export function RevLearnSidebar() {
  const { active } = useActiveProfile();
  return (
    <aside className="rl-sidebar">
      <Link href="/revlearn" className="rl-sidebar-brand" style={{ textDecoration: "none" }}>
        <div className="rl-sidebar-logo-box"><BookOpen size={22} color="#fff" /></div>
        <div>
          <span className="rl-sidebar-wordmark">
            <span className="rl-sidebar-rev">rev</span>
            <span className="rl-sidebar-learn">Learn</span>
          </span>
          <span className="rl-sidebar-tagline">Teachers training hub</span>
        </div>
      </Link>
      <nav className="rl-sidebar-nav">
        {NAV.map(n => <NavLink key={n.href} {...n} />)}
      </nav>
      <a href="https://revstore.revrica.com" target="_blank" rel="noopener noreferrer" style={{display:"block",margin:"0 .75rem .75rem",padding:"1rem",background:"linear-gradient(135deg,rgba(255,107,26,.12) 0%,rgba(74,14,16,.28) 100%)",border:"1px solid rgba(255,107,26,.2)",borderRadius:12,textDecoration:"none"}}>
        <p style={{margin:"0 0 .2rem",fontSize:".56rem",fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"rgba(255,255,255,.38)"}}>RevStore</p>
        <p style={{margin:"0 0 .3rem",fontSize:".8rem",fontWeight:800,color:"#fff",lineHeight:1.2}}>Own a Rev Laptop</p>
        <p style={{margin:"0 0 .5rem",fontSize:".72rem",color:"rgba(255,255,255,.5)",lineHeight:1.4}}>From ₦15,000/month. Zero upfront.</p>
        <span style={{fontSize:".72rem",fontWeight:700,color:"var(--rl-orange)"}}>Apply now →</span>
      </a>
      <div className="rl-sidebar-footer">
        {active ? (
          <Link href="/revlearn/profile" className="rl-sidebar-profile" style={{ textDecoration: "none" }}>
            <Avatar name={active.name} color={getAvatarColor(active.name)} size={34} />
            <div className="rl-sidebar-profile-text">
              <span className="rl-sidebar-profile-name">{active.name}</span>
              <span className="rl-sidebar-profile-school">{active.school}</span>
            </div>
          </Link>
        ) : (
          <Link href="/revlearn/profile" className="rl-sidebar-setup" style={{ textDecoration: "none" }}>
            <UserCircle size={16} /> Set up profile
          </Link>
        )}
      </div>
    </aside>
  );
}

// ── Header ─────────────────────────────────────────────────────
export function RevLearnHeader() {
  const { theme, toggle } = useRLTheme();
  const { active } = useActiveProfile();
  const dateStr = new Date().toLocaleDateString("en-NG", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

  return (
    <header className="rl-header">
      <div className="rl-header-inner">
        <p className="rl-header-date">{new Date().toLocaleDateString("en-NG",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</p>
        <div className="rl-header-right">
          <button className="rl-hbtn" onClick={toggle} aria-label="Toggle theme">
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          <button className="rl-hbtn rl-hbtn-notif" aria-label="Notifications">
            <Bell size={16} />
            <span className="rl-notif-dot" />
          </button>
          <ProfileSwitcher />
        </div>
      </div>
    </header>
  );
}

// ── Bottom nav ─────────────────────────────────────────────────
export function RevLearnBottomNav() {
  return (
    <nav className="rl-bottom-nav">
      {NAV.map(n => <BottomLink key={n.href} {...n} />)}
    </nav>
  );
}

// ── Shell ──────────────────────────────────────────────────────
export function RevLearnShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="rl-shell">
      <RevLearnSidebar />
      <div className="rl-shell-main">
        <RevLearnHeader />
        <div className="rl-shell-content">{children}</div>
      </div>
      <RevLearnBottomNav />
    </div>
  );
}
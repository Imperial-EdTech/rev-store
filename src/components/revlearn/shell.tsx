"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { BookOpen, Wrench, FileText, Users, Home, Moon, Sun, User } from "lucide-react";
import { getInitials, getAvatarColor } from "@/lib/revlearn-utils";
import { useProfile } from "@/lib/revlearn-hooks";

type Theme = "light" | "dark";
const ThemeCtx = createContext<{ theme: Theme; toggle: () => void }>({ theme: "light", toggle: () => {} });
export const useRLTheme = () => useContext(ThemeCtx);

export function RevLearnProviders({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("rl-theme") as Theme | null;
    setTheme(stored ?? "light");
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-rl", theme);
    localStorage.setItem("rl-theme", theme);
  }, [theme, mounted]);

  useEffect(() => {
    if ("serviceWorker" in navigator)
      navigator.serviceWorker.register("/revlearn-sw.js", { scope: "/revlearn" }).catch(() => {});
  }, []);

  const toggle = useCallback(() => setTheme(t => t === "light" ? "dark" : "light"), []);

  return (
    <ThemeCtx.Provider value={{ theme, toggle }}>
      <div className="rl-app" data-rl={mounted ? theme : "light"}>{children}</div>
    </ThemeCtx.Provider>
  );
}

const NAV = [
  { href: "/revlearn",           label: "Home",      Icon: Home,     exact: true },
  { href: "/revlearn/courses",   label: "Courses",   Icon: BookOpen, exact: false },
  { href: "/revlearn/tools",     label: "Tools",     Icon: Wrench,   exact: false },
  { href: "/revlearn/resources", label: "Resources", Icon: FileText, exact: false },
  { href: "/revlearn/community", label: "Community", Icon: Users,    exact: false },
];

function Avatar({ name, color, size = 28 }: { name: string; color: string; size?: number }) {
  return (
    <span style={{
      width: size, height: size, background: color, fontSize: size * 0.36,
      borderRadius: "50%", display: "inline-flex", alignItems: "center",
      justifyContent: "center", color: "#fff", fontWeight: 700,
      flexShrink: 0, letterSpacing: "-.02em",
    }}>
      {getInitials(name)}
    </span>
  );
}

function SidebarLink({ href, label, Icon, exact }: { href: string; label: string; Icon: React.ElementType; exact: boolean }) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname.startsWith(href);
  return (
    <Link href={href} className={`rl-sidebar-link${active ? " rl-sidebar-link--active" : ""}`}>
      <Icon size={18} /><span>{label}</span>
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

export function RevLearnHeader() {
  const { theme, toggle } = useRLTheme();
  const { profile } = useProfile();

  return (
    <header className="rl-header">
      <div className="rl-header-inner">
        <Link href="/revlearn" className="rl-logo" style={{ textDecoration: "none" }}>
          <span className="rl-logo-rev">rev</span><span className="rl-logo-learn">Learn</span>
        </Link>
        <span className="rl-header-tagline">The teachers training hub</span>
        <div className="rl-header-right">
          <button className="rl-hbtn" onClick={toggle} aria-label="Toggle theme">
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          <Link href="/revlearn/profile" className="rl-hbtn" aria-label="Profile">
            {profile ? <Avatar name={profile.name} color={getAvatarColor(profile.name)} size={26} /> : <User size={16} />}
          </Link>
          <Link href="/" className="rl-site-btn">revrica.com</Link>
        </div>
      </div>
    </header>
  );
}

export function RevLearnSidebar() {
  const { profile } = useProfile();
  return (
    <aside className="rl-sidebar">
      <Link href="/revlearn" className="rl-sidebar-logo" style={{ textDecoration: "none" }}>
        <span className="rl-logo-rev">rev</span><span className="rl-logo-learn">Learn</span>
      </Link>
      <p className="rl-sidebar-tagline">The teachers training hub</p>
      <nav className="rl-sidebar-nav">
        {NAV.map(n => <SidebarLink key={n.href} {...n} />)}
      </nav>
      <div className="rl-sidebar-profile">
        {profile ? (
          <Link href="/revlearn/profile" className="rl-sidebar-profile-link">
            <Avatar name={profile.name} color={getAvatarColor(profile.name)} size={32} />
            <div className="rl-sidebar-profile-text">
              <span className="rl-sidebar-profile-name">{profile.name}</span>
              <span className="rl-sidebar-profile-school">{profile.school}</span>
            </div>
          </Link>
        ) : (
          <Link href="/revlearn/profile" className="rl-sidebar-setup-link">
            <User size={15} /> Set up your profile
          </Link>
        )}
      </div>
    </aside>
  );
}

export function RevLearnBottomNav() {
  return (
    <nav className="rl-bottom-nav">
      {NAV.map(n => <BottomLink key={n.href} {...n} />)}
    </nav>
  );
}

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
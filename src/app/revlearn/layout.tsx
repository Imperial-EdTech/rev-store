import { type Metadata } from "next";
import { RevLearnProviders } from "@/components/revlearn/shell";

export const metadata: Metadata = {
  title: "RevLearn | The Teachers Training Hub",
  description: "Free resources for teachers — all in one place.",
};

// Server component — wraps client providers, injects CSS reliably
export default function RevLearnLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <RevLearnProviders>
        {children}
      </RevLearnProviders>
    </>
  );
}

const CSS = `
:root {
  --rl-orange: #FF6B1A;
  --rl-orange-deep: #e05510;
  --rl-orange-soft: #fff4ee;
  --rl-maroon: #4a0e10;
  --rl-maroon-mid: #6b1518;
  --rl-maroon-light: #f8eaea;
  --rl-teal: #0d7b6b;
  --rl-teal-soft: #e0f7f4;
  --rl-bg: #ffffff;
  --rl-bg-page: #f8f9fb;
  --rl-bg-subtle: #f2f4f7;
  --rl-bg-sunken: #e8eaed;
  --rl-ink: #1c1d1f;
  --rl-ink-soft: #3c3d3f;
  --rl-body: #5c5f62;
  --rl-line: #e0e0e0;
  --rl-line-strong: #c4c4c4;
  --rl-sidebar-w: 240px;
  --rl-header-h: 64px;
  --rl-bottom-h: 60px;
  --rl-radius-sm: 8px;
  --rl-radius: 12px;
  --rl-radius-lg: 16px;
  --rl-radius-xl: 24px;
  --rl-shadow-xs: 0 1px 2px rgba(0,0,0,.06);
  --rl-shadow-sm: 0 1px 4px rgba(0,0,0,.08), 0 2px 8px rgba(0,0,0,.04);
  --rl-shadow: 0 2px 8px rgba(0,0,0,.10), 0 4px 16px rgba(0,0,0,.06);
  --rl-shadow-lg: 0 8px 24px rgba(0,0,0,.12), 0 16px 48px rgba(0,0,0,.08);
}
[data-rl="dark"] {
  --rl-bg: #1c1d1f;
  --rl-bg-page: #141516;
  --rl-bg-subtle: #242628;
  --rl-bg-sunken: #2d2f31;
  --rl-ink: #f4f4f4;
  --rl-ink-soft: #d4d4d4;
  --rl-body: #a4a4a4;
  --rl-line: #2d2f31;
  --rl-line-strong: #3d3f41;
  --rl-orange-soft: #2a1205;
  --rl-maroon-light: #1e0c0e;
  --rl-teal-soft: #061f1b;
  --rl-shadow-xs: 0 1px 2px rgba(0,0,0,.3);
  --rl-shadow-sm: 0 1px 4px rgba(0,0,0,.3), 0 2px 8px rgba(0,0,0,.2);
  --rl-shadow: 0 2px 8px rgba(0,0,0,.4), 0 4px 16px rgba(0,0,0,.3);
}
.rl-app { min-height:100vh; background:var(--rl-bg-page); color:var(--rl-ink); font-family:"Inter Variable",ui-sans-serif,system-ui,-apple-system,sans-serif; -webkit-font-smoothing:antialiased; }
.rl-spin { animation:rl-spin 1s linear infinite; }
@keyframes rl-spin { to { transform:rotate(360deg); } }
.rl-state-center { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:.875rem; padding:5rem 1rem; color:var(--rl-body); font-size:.9rem; }
.rl-shell { display:flex; min-height:100vh; }
.rl-shell-main { flex:1; min-width:0; display:flex; flex-direction:column; }
.rl-shell-content { flex:1; overflow-x:hidden; padding-bottom:var(--rl-bottom-h); }
@media (min-width:900px) { .rl-shell-content { padding-bottom:0; } }
.rl-sidebar { width:var(--rl-sidebar-w); flex-shrink:0; background:var(--rl-maroon); display:none; flex-direction:column; position:sticky; top:0; height:100vh; overflow-y:auto; scrollbar-width:none; }
.rl-sidebar::-webkit-scrollbar { display:none; }
@media (min-width:900px) { .rl-sidebar { display:flex; } }
.rl-sidebar-brand { display:flex; align-items:center; gap:.875rem; text-decoration:none; padding:1.25rem 1.25rem 1rem; border-bottom:1px solid rgba(255,255,255,.08); margin-bottom:.5rem; }
.rl-sidebar-logo-box { width:38px; height:38px; border-radius:10px; background:rgba(255,255,255,.15); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.rl-sidebar-wordmark { display:block; font-family:"Archivo Variable",ui-sans-serif,system-ui; font-size:1.05rem; line-height:1; }
.rl-sidebar-rev { color:rgba(255,255,255,.8); font-weight:300; }
.rl-sidebar-learn { color:var(--rl-orange); font-weight:800; }
.rl-sidebar-tagline { display:block; font-size:.56rem; font-weight:500; letter-spacing:.07em; text-transform:uppercase; color:rgba(255,255,255,.35); margin-top:3px; }
.rl-sidebar-nav { display:flex; flex-direction:column; gap:1px; padding:0 .75rem; flex:1; }
.rl-nav-link { display:flex; align-items:center; gap:.75rem; padding:.6875rem .875rem; border-radius:var(--rl-radius-sm); text-decoration:none; font-size:.875rem; font-weight:500; color:rgba(255,255,255,.55); transition:background .15s,color .15s; white-space:nowrap; }
.rl-nav-link:hover { background:rgba(255,255,255,.08); color:rgba(255,255,255,.9); }
.rl-nav-link--active { background:rgba(255,255,255,.14) !important; color:#fff !important; font-weight:600; }
.rl-nav-icon { display:flex; flex-shrink:0; }
.rl-sidebar-footer { padding:.875rem .75rem; border-top:1px solid rgba(255,255,255,.08); margin-top:auto; }
.rl-sidebar-profile { display:flex; align-items:center; gap:.75rem; padding:.5rem .625rem; border-radius:var(--rl-radius-sm); text-decoration:none; transition:background .15s; cursor:pointer; }
.rl-sidebar-profile:hover { background:rgba(255,255,255,.08); }
.rl-sidebar-profile-text { display:flex; flex-direction:column; min-width:0; }
.rl-sidebar-profile-name { font-size:.82rem; font-weight:700; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.rl-sidebar-profile-school { font-size:.68rem; color:rgba(255,255,255,.45); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.rl-sidebar-setup { display:flex; align-items:center; gap:.5rem; text-decoration:none; font-size:.8rem; font-weight:600; color:rgba(255,255,255,.5); padding:.5rem .625rem; border-radius:var(--rl-radius-sm); transition:background .15s; }
.rl-sidebar-setup:hover { background:rgba(255,255,255,.08); color:rgba(255,255,255,.8); }
.rl-header { height:var(--rl-header-h); background:var(--rl-bg); border-bottom:1px solid var(--rl-line); position:sticky; top:0; z-index:40; }
.rl-header-inner { display:flex; align-items:center; gap:.875rem; height:100%; padding:0 1.5rem; }
.rl-header-greeting { flex:1; min-width:0; }
.rl-header-date { font-size:.72rem; color:var(--rl-body); margin:0; line-height:1; }
.rl-header-welcome { font-size:.9rem; color:var(--rl-ink); margin:2px 0 0; display:none; }
@media (min-width:600px) { .rl-header-welcome { display:block; } }
.rl-header-right { display:flex; align-items:center; gap:8px; margin-left:auto; }
.rl-hbtn { display:flex; align-items:center; justify-content:center; width:36px; height:36px; border:1px solid var(--rl-line); border-radius:var(--rl-radius-sm); background:transparent; color:var(--rl-body); cursor:pointer; transition:all .15s; text-decoration:none; flex-shrink:0; position:relative; }
.rl-hbtn:hover { color:var(--rl-maroon); border-color:var(--rl-maroon); background:var(--rl-maroon-light); }
.rl-notif-dot { position:absolute; top:7px; right:7px; width:7px; height:7px; background:var(--rl-orange); border-radius:50%; border:1.5px solid var(--rl-bg); }
.rl-site-btn { font-size:.7rem; font-weight:700; letter-spacing:.04em; color:var(--rl-body); text-decoration:none; padding:6px 12px; border:1px solid var(--rl-line); border-radius:999px; white-space:nowrap; transition:all .15s; display:none; }
@media (min-width:640px) { .rl-site-btn { display:inline-block; } }
.rl-site-btn:hover { color:var(--rl-maroon); border-color:var(--rl-maroon); }
.rl-profile-switcher { position:relative; }
.rl-header-profile-btn { display:flex; align-items:center; gap:.5rem; padding:4px 10px 4px 4px; border:1px solid var(--rl-line); border-radius:999px; background:var(--rl-bg); cursor:pointer; transition:all .15s; text-decoration:none; color:var(--rl-ink); }
.rl-header-profile-btn:hover { border-color:var(--rl-maroon); background:var(--rl-maroon-light); }
.rl-header-profile-text { display:none; flex-direction:column; }
@media (min-width:640px) { .rl-header-profile-text { display:flex; } }
.rl-header-profile-name { font-size:.8rem; font-weight:700; color:var(--rl-ink); line-height:1.25; }
.rl-header-profile-sub { font-size:.66rem; color:var(--rl-body); line-height:1.25; }
.rl-profile-dropdown { position:absolute; top:calc(100% + 8px); right:0; background:var(--rl-bg); border:1px solid var(--rl-line); border-radius:var(--rl-radius-lg); box-shadow:var(--rl-shadow-lg); min-width:240px; z-index:100; padding:.5rem; }
.rl-profile-dropdown-label { font-size:.64rem; font-weight:700; text-transform:uppercase; letter-spacing:.1em; color:var(--rl-body); padding:.375rem .75rem; margin:0; }
.rl-profile-dropdown-item { display:flex; align-items:center; gap:3px; }
.rl-profile-dropdown-btn { display:flex; align-items:center; gap:.625rem; flex:1; padding:.5rem .75rem; border:none; border-radius:var(--rl-radius-sm); background:transparent; cursor:pointer; text-align:left; transition:background .15s; }
.rl-profile-dropdown-btn:hover { background:var(--rl-bg-subtle); }
.rl-profile-dropdown-btn--active { background:var(--rl-maroon-light); }
.rl-profile-dropdown-info { display:flex; flex-direction:column; flex:1; min-width:0; }
.rl-profile-dropdown-name { font-size:.84rem; font-weight:700; color:var(--rl-ink); }
.rl-profile-dropdown-sub { font-size:.72rem; color:var(--rl-body); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.rl-profile-active-check { color:var(--rl-maroon); margin-left:auto; flex-shrink:0; }
.rl-profile-delete-btn { display:flex; align-items:center; justify-content:center; width:28px; height:28px; border:1px solid transparent; border-radius:6px; background:transparent; color:var(--rl-body); cursor:pointer; flex-shrink:0; transition:all .15s; }
.rl-profile-delete-btn:hover { border-color:#ef4444; color:#ef4444; background:#fef2f2; }
.rl-profile-add-btn { display:flex; align-items:center; gap:6px; width:100%; padding:.5rem .75rem; border:none; border-radius:var(--rl-radius-sm); background:transparent; color:var(--rl-maroon); font-size:.82rem; font-weight:600; cursor:pointer; transition:background .15s; margin-top:2px; }
.rl-profile-add-btn:hover { background:var(--rl-maroon-light); }
.rl-profile-dropdown-divider { height:1px; background:var(--rl-line); margin:.375rem 0; }
.rl-profile-edit-link { display:block; padding:.5rem .75rem; font-size:.78rem; font-weight:600; color:var(--rl-body); text-decoration:none; border-radius:var(--rl-radius-sm); transition:background .15s; }
.rl-profile-edit-link:hover { background:var(--rl-bg-subtle); color:var(--rl-ink); }
.rl-bottom-nav { display:flex; position:fixed; bottom:0; left:0; right:0; height:var(--rl-bottom-h); background:var(--rl-bg); border-top:1px solid var(--rl-line); z-index:40; box-shadow:0 -2px 12px rgba(0,0,0,.06); }
@media (min-width:900px) { .rl-bottom-nav { display:none; } }
.rl-bottom-link { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:3px; text-decoration:none; color:var(--rl-body); font-size:.58rem; font-weight:600; letter-spacing:.02em; transition:color .15s; }
.rl-bottom-link--active { color:var(--rl-maroon); }
.rl-connectivity-banner { display:flex; align-items:center; gap:.5rem; padding:.5rem 1.5rem; font-size:.78rem; font-weight:600; background:#1a1a2e; color:rgba(255,255,255,.85); }
.rl-connectivity-banner--back { background:var(--rl-teal-soft); color:var(--rl-teal); }
.rl-dashboard {}
.rl-welcome-banner { background:linear-gradient(135deg,#1a0a0b 0%,var(--rl-maroon) 40%,#6b1518 100%); padding:2.5rem 2rem; display:flex; align-items:center; justify-content:space-between; gap:2rem; flex-wrap:wrap; position:relative; overflow:hidden; min-height:180px; }
.rl-welcome-banner::before { content:""; position:absolute; inset:0; background:radial-gradient(ellipse at 75% 50%,rgba(255,107,26,.18) 0%,transparent 60%); pointer-events:none; }
.rl-welcome-left { position:relative; z-index:1; max-width:540px; }
.rl-welcome-eyebrow { font-size:.7rem; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:var(--rl-orange); margin:0 0 .625rem; }
.rl-welcome-title { font-family:"Archivo Variable",ui-sans-serif,system-ui; font-size:clamp(1.625rem,4vw,2.375rem); font-weight:800; color:#fff; margin:0 0 .5rem; letter-spacing:-.02em; line-height:1.1; }
.rl-welcome-sub { font-size:.925rem; color:rgba(255,255,255,.6); margin:0 0 1.25rem; }
.rl-welcome-cta { display:inline-flex; align-items:center; gap:6px; padding:9px 20px; background:var(--rl-orange); color:#fff; border-radius:999px; font-size:.875rem; font-weight:700; text-decoration:none; transition:background .15s; }
.rl-welcome-cta:hover { background:var(--rl-orange-deep); }
.rl-welcome-right { position:relative; z-index:1; }
.rl-welcome-stats { display:flex; align-items:center; background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.12); border-radius:var(--rl-radius-lg); overflow:hidden; }
.rl-welcome-stat { display:flex; flex-direction:column; align-items:center; gap:2px; padding:1.125rem 1.5rem; }
.rl-welcome-stat+.rl-welcome-stat { border-left:1px solid rgba(255,255,255,.1); }
.rl-welcome-stat-val { font-family:"Archivo Variable",ui-sans-serif,system-ui; font-size:1.75rem; font-weight:800; color:#fff; line-height:1; }
.rl-welcome-stat-label { font-size:.65rem; font-weight:600; color:rgba(255,255,255,.5); text-transform:uppercase; letter-spacing:.07em; white-space:nowrap; }
.rl-dash-search-bar { background:var(--rl-bg); border-bottom:1px solid var(--rl-line); padding:1rem 2rem; display:flex; align-items:center; gap:1rem; }
.rl-dash-search-inner { display:flex; align-items:center; flex:1; max-width:600px; background:var(--rl-bg-subtle); border:1.5px solid var(--rl-line); border-radius:999px; padding:0 1rem; transition:border-color .15s,box-shadow .15s; }
.rl-dash-search-inner:focus-within { border-color:var(--rl-maroon); box-shadow:0 0 0 3px rgba(74,14,16,.08); background:var(--rl-bg); }
.rl-dash-search-icon { color:var(--rl-body); flex-shrink:0; }
.rl-dash-search-input { flex:1; height:44px; padding:0 10px; background:transparent; border:none; color:var(--rl-ink); font-size:.9rem; outline:none; font-family:inherit; }
.rl-dash-search-input::placeholder { color:var(--rl-body); }
.rl-dash-search-clear { background:transparent; border:none; color:var(--rl-body); cursor:pointer; padding:4px; font-size:.875rem; line-height:1; }
.rl-partners-strip { background:var(--rl-bg); border-bottom:1px solid var(--rl-line); padding:.875rem 2rem; overflow:hidden; }
.rl-partners-label { font-size:.72rem; color:var(--rl-body); margin:0 0 .625rem; font-weight:500; }
.rl-partners-row { display:flex; align-items:center; gap:1.25rem; overflow-x:auto; scrollbar-width:none; }
.rl-partners-row::-webkit-scrollbar { display:none; }
.rl-partner-chip { display:flex; align-items:center; gap:.375rem; padding:5px 12px; border:1px solid var(--rl-line); border-radius:999px; text-decoration:none; white-space:nowrap; font-size:.78rem; font-weight:600; color:var(--rl-ink); background:var(--rl-bg); transition:border-color .15s,background .15s; flex-shrink:0; }
.rl-partner-chip:hover { border-color:var(--rl-maroon); background:var(--rl-maroon-light); }
.rl-category-pills { display:flex; align-items:center; gap:.5rem; overflow-x:auto; scrollbar-width:none; padding:1rem 2rem; background:var(--rl-bg); border-bottom:1px solid var(--rl-line); }
.rl-category-pills::-webkit-scrollbar { display:none; }
.rl-category-pill { display:flex; align-items:center; gap:6px; padding:7px 14px; border:1.5px solid var(--rl-line); border-radius:999px; background:var(--rl-bg); color:var(--rl-ink); font-size:.82rem; font-weight:500; cursor:pointer; white-space:nowrap; flex-shrink:0; transition:all .15s; text-decoration:none; }
.rl-category-pill:hover { border-color:var(--rl-maroon); color:var(--rl-maroon); }
.rl-category-pill--active { background:var(--rl-maroon) !important; border-color:var(--rl-maroon) !important; color:#fff !important; font-weight:600; }
.rl-dash-body { padding:1.5rem 2rem 3rem; display:flex; flex-direction:column; gap:2rem; }
@media (max-width:600px) { .rl-dash-body { padding:1.25rem 1rem 3rem; } }
.rl-section-hd { display:flex; align-items:baseline; justify-content:space-between; gap:1rem; margin-bottom:1rem; }
.rl-section-title { font-family:"Archivo Variable",ui-sans-serif,system-ui; font-size:1.1rem; font-weight:700; color:var(--rl-ink); margin:0; display:flex; align-items:center; gap:.5rem; }
.rl-see-all { display:inline-flex; align-items:center; gap:4px; font-size:.82rem; font-weight:600; color:var(--rl-maroon); text-decoration:none; white-space:nowrap; }
.rl-see-all:hover { text-decoration:underline; }
.rl-clear { font-size:.8rem; font-weight:600; color:var(--rl-maroon); background:none; border:none; cursor:pointer; }
.rl-metric-cards { display:grid; grid-template-columns:repeat(2,1fr); gap:1rem; }
@media (min-width:600px) { .rl-metric-cards { grid-template-columns:repeat(4,1fr); } }
.rl-metric-card { background:var(--rl-bg); border:1px solid var(--rl-line); border-radius:var(--rl-radius-lg); padding:1.25rem 1rem; display:flex; flex-direction:column; align-items:flex-start; gap:.375rem; box-shadow:var(--rl-shadow-xs); transition:transform .15s,box-shadow .15s; border-top:3px solid var(--metric-color,var(--rl-maroon)); text-decoration:none; color:inherit; }
.rl-metric-card:hover { transform:translateY(-2px); box-shadow:var(--rl-shadow-sm); }
.rl-metric-icon { font-size:1.375rem; line-height:1; }
.rl-metric-value { font-family:"Archivo Variable",ui-sans-serif,system-ui; font-size:1.875rem; font-weight:800; color:var(--rl-ink); line-height:1; }
.rl-metric-label { font-size:.72rem; font-weight:600; text-transform:uppercase; letter-spacing:.06em; color:var(--rl-body); }
.rl-quicklinks-row { display:flex; gap:.75rem; overflow-x:auto; scrollbar-width:none; padding-bottom:4px; }
.rl-quicklinks-row::-webkit-scrollbar { display:none; }
.rl-quicklink { display:flex; flex-direction:column; align-items:center; gap:.5rem; padding:1rem .875rem; background:var(--rl-bg); border:1px solid var(--rl-line); border-radius:var(--rl-radius-lg); text-decoration:none; min-width:90px; flex-shrink:0; transition:border-color .15s,transform .15s,box-shadow .15s; box-shadow:var(--rl-shadow-xs); position:relative; }
.rl-quicklink:hover { border-color:var(--rl-maroon); transform:translateY(-2px); box-shadow:var(--rl-shadow-sm); }
.rl-quicklink-logo { width:44px; height:44px; border-radius:var(--rl-radius-sm); background:var(--rl-bg-subtle); display:flex; align-items:center; justify-content:center; overflow:hidden; font-family:"Archivo Variable",ui-sans-serif; font-weight:800; font-size:1.125rem; color:var(--rl-maroon); }
.rl-quicklink-logo img { width:100%; height:100%; object-fit:contain; }
.rl-quicklink-name { font-size:.7rem; font-weight:600; color:var(--rl-ink); text-align:center; line-height:1.2; max-width:80px; }
.rl-quicklink-ext { position:absolute; top:6px; right:6px; color:var(--rl-body); opacity:.4; }
.rl-course-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:1.25rem; }
.rl-course-card { display:flex; flex-direction:column; background:var(--rl-bg); border:1px solid var(--rl-line); border-radius:var(--rl-radius-lg); overflow:hidden; text-decoration:none; box-shadow:var(--rl-shadow-xs); transition:border-color .2s,transform .15s,box-shadow .2s; }
.rl-course-card:hover { border-color:var(--rl-maroon); transform:translateY(-3px); box-shadow:var(--rl-shadow); }
.rl-course-card--done { border-color:var(--rl-teal) !important; }
.rl-course-thumb { width:100%; aspect-ratio:16/9; background:var(--rl-bg-sunken) center/cover no-repeat; position:relative; overflow:hidden; }
.rl-course-thumb-img { width:100%; height:100%; object-fit:cover; transition:transform .3s; }
.rl-course-card:hover .rl-course-thumb-img { transform:scale(1.04); }
.rl-course-done-badge { position:absolute; top:8px; right:8px; display:flex; align-items:center; gap:3px; background:var(--rl-teal); color:#fff; font-size:.65rem; font-weight:700; padding:2px 8px; border-radius:999px; }
.rl-course-card-body { padding:.875rem 1rem 1rem; display:flex; flex-direction:column; gap:.25rem; flex:1; }
.rl-course-source { font-size:.66rem; font-weight:700; text-transform:uppercase; letter-spacing:.1em; color:var(--rl-orange); }
.rl-course-title { font-family:"Archivo Variable",ui-sans-serif,system-ui; font-size:.9rem; font-weight:700; color:var(--rl-ink); margin:0; line-height:1.35; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.rl-course-desc { font-size:.78rem; line-height:1.5; color:var(--rl-body); margin:0; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.rl-course-meta { display:flex; align-items:center; gap:.5rem; font-size:.72rem; color:var(--rl-body); margin-top:4px; }
.rl-dash-2col { display:flex; flex-direction:column; gap:1.5rem; }
@media (min-width:1100px) { .rl-dash-2col { flex-direction:row; align-items:flex-start; } .rl-dash-main { flex:1; min-width:0; } .rl-dash-side { width:300px; flex-shrink:0; position:sticky; top:80px; display:flex; flex-direction:column; gap:1rem; } }
.rl-side-card { background:var(--rl-bg); border:1px solid var(--rl-line); border-radius:var(--rl-radius-lg); padding:1.125rem; box-shadow:var(--rl-shadow-xs); }
.rl-side-card-hd { display:flex; align-items:center; justify-content:space-between; margin-bottom:.875rem; }
.rl-side-card-title { font-family:"Archivo Variable",ui-sans-serif,system-ui; font-size:.9rem; font-weight:700; color:var(--rl-ink); margin:0; display:flex; align-items:center; gap:.375rem; }
.rl-side-empty { font-size:.84rem; color:var(--rl-body); text-align:center; padding:1rem 0; }
.rl-res-list { display:flex; flex-direction:column; }
.rl-res-item { display:flex; align-items:center; gap:.75rem; padding:.625rem .5rem; border-radius:var(--rl-radius-sm); text-decoration:none; transition:background .15s; border-bottom:1px solid var(--rl-line); }
.rl-res-item:last-child { border-bottom:none; }
.rl-res-item:hover { background:var(--rl-bg-subtle); }
.rl-res-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
.rl-res-dot--article { background:#0056d2; }
.rl-res-dot--template { background:#6600cc; }
.rl-res-dot--app { background:var(--rl-teal); }
.rl-res-dot--website { background:var(--rl-body); }
.rl-res-dot--video { background:var(--rl-orange); }
.rl-res-text { flex:1; min-width:0; }
.rl-res-title { font-size:.82rem; font-weight:600; color:var(--rl-ink); margin:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.rl-res-meta { font-size:.68rem; color:var(--rl-body); margin:0; }
.rl-comm-list { display:flex; flex-direction:column; }
.rl-comm-item { display:flex; align-items:flex-start; gap:.625rem; padding:.625rem .25rem; text-decoration:none; border-bottom:1px solid var(--rl-line); transition:background .15s; border-radius:var(--rl-radius-sm); }
.rl-comm-item:last-child { border-bottom:none; }
.rl-comm-item:hover { background:var(--rl-bg-subtle); }
.rl-comm-avatar { width:28px; height:28px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; color:#fff; font-weight:700; font-size:.72rem; }
.rl-comm-body { flex:1; min-width:0; }
.rl-comm-author { font-size:.78rem; font-weight:700; color:var(--rl-ink); margin:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.rl-comm-content { font-size:.75rem; color:var(--rl-body); margin:0; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.rl-comm-time { font-size:.65rem; color:var(--rl-body); white-space:nowrap; }
.rl-offline-list { display:flex; flex-direction:column; gap:.375rem; }
.rl-offline-item { display:flex; align-items:center; gap:.625rem; padding:.375rem 0; }
.rl-offline-title { flex:1; font-size:.82rem; color:var(--rl-ink); min-width:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.rl-offline-size { font-size:.68rem; color:var(--rl-body); flex-shrink:0; }
.rl-search-results { display:flex; flex-direction:column; gap:.625rem; }
.rl-search-item { display:flex; align-items:flex-start; gap:.875rem; padding:.875rem 1rem; background:var(--rl-bg); border:1px solid var(--rl-line); border-radius:var(--rl-radius); text-decoration:none; transition:border-color .15s; box-shadow:var(--rl-shadow-xs); }
.rl-search-item:hover { border-color:var(--rl-maroon); }
.rl-search-kind-pill { flex-shrink:0; font-size:.64rem; font-weight:700; text-transform:uppercase; letter-spacing:.08em; padding:3px 8px; border-radius:999px; }
.rl-search-kind-pill--course { background:var(--rl-maroon-light); color:var(--rl-maroon); }
.rl-search-kind-pill--tool { background:var(--rl-teal-soft); color:var(--rl-teal); }
.rl-search-kind-pill--resource { background:var(--rl-bg-subtle); color:var(--rl-body); border:1px solid var(--rl-line); }
.rl-search-item-title { font-size:.9rem; font-weight:700; color:var(--rl-ink); margin:0 0 .2rem; }
.rl-search-item-sub { font-size:.8rem; color:var(--rl-body); margin:0; }
.rl-search-empty { color:var(--rl-body); font-size:.9rem; padding:1rem 0; }
.rl-page-hero { background:linear-gradient(135deg,#1a0a0b 0%,var(--rl-maroon) 50%,#6b1518 100%); padding:2rem 2rem; position:relative; overflow:hidden; }
.rl-page-hero::before { content:""; position:absolute; inset:0; background:radial-gradient(ellipse at 80% 50%,rgba(255,107,26,.12) 0%,transparent 60%); pointer-events:none; }
.rl-page-hero>* { position:relative; z-index:1; }
.rl-page-kicker { font-size:.68rem; font-weight:700; letter-spacing:.18em; text-transform:uppercase; color:var(--rl-orange); margin:0 0 .5rem; }
.rl-page-title { font-family:"Archivo Variable",ui-sans-serif,system-ui; font-size:clamp(1.375rem,4vw,2rem); font-weight:800; color:#fff; margin:0 0 .5rem; letter-spacing:-.02em; line-height:1.15; }
.rl-page-sub { color:rgba(255,255,255,.6); font-size:.9rem; margin:0 0 1.125rem; max-width:520px; }
.rl-page-search { display:block; width:100%; max-width:440px; height:42px; padding:0 16px; background:rgba(255,255,255,.12); border:1px solid rgba(255,255,255,.2); border-radius:999px; color:#fff; font-size:.875rem; outline:none; box-sizing:border-box; font-family:inherit; }
.rl-page-search::placeholder { color:rgba(255,255,255,.45); }
.rl-page-body { padding:1.5rem 2rem 4rem; }
@media (max-width:600px) { .rl-page-body { padding:1.25rem 1rem 4rem; } }
.rl-tags { display:flex; flex-wrap:wrap; gap:4px; }
.rl-tag { display:inline-block; padding:3px 8px; background:var(--rl-bg-subtle); color:var(--rl-body); font-size:.66rem; font-weight:600; border-radius:999px; border:1px solid var(--rl-line); }
.rl-source-pill { display:inline-block; padding:3px 9px; background:var(--rl-maroon-light); color:var(--rl-maroon); border-radius:999px; font-size:.68rem; font-weight:700; letter-spacing:.04em; }
.rl-breadcrumb { display:flex; align-items:center; gap:5px; font-size:.78rem; color:var(--rl-body); margin-bottom:1.25rem; flex-wrap:wrap; }
.rl-breadcrumb a { color:var(--rl-maroon); text-decoration:none; }
.rl-breadcrumb a:hover { text-decoration:underline; }
.rl-error-box { display:flex; gap:1rem; padding:1rem 1.25rem; background:var(--rl-maroon-light); border:1px solid rgba(74,14,16,.15); border-radius:var(--rl-radius); color:var(--rl-maroon); margin:1rem 0; }
.rl-error-title { font-weight:700; margin:0 0 .25rem; }
.rl-retry-btn { margin-top:.5rem; padding:6px 14px; background:var(--rl-maroon); color:#fff; border:none; border-radius:999px; font-size:.8rem; font-weight:700; cursor:pointer; text-decoration:none; display:inline-block; }
.rl-empty { text-align:center; padding:3rem 1rem; color:var(--rl-body); }
.rl-empty a { color:var(--rl-maroon); }
.rl-empty-icon { font-size:2.5rem; margin:0 0 .625rem; }
.rl-empty-text { font-size:.9rem; }
.rl-tools-grid { display:grid; grid-template-columns:1fr; gap:1rem; }
@media (min-width:560px) { .rl-tools-grid { grid-template-columns:repeat(2,1fr); } }
@media (min-width:900px) { .rl-tools-grid { grid-template-columns:repeat(3,1fr); } }
.rl-tool-card { display:flex; flex-direction:column; background:var(--rl-bg); border:1px solid var(--rl-line); border-radius:var(--rl-radius-lg); overflow:hidden; text-decoration:none; box-shadow:var(--rl-shadow-xs); transition:border-color .2s,transform .15s,box-shadow .15s; }
.rl-tool-card:hover { border-color:var(--rl-maroon); transform:translateY(-3px); box-shadow:var(--rl-shadow); }
.rl-tool-card-logo { display:flex; align-items:center; justify-content:center; height:80px; background:var(--rl-bg-subtle); border-bottom:1px solid var(--rl-line); }
.rl-tool-card-logo img { max-height:48px; max-width:75%; object-fit:contain; }
.rl-tool-logo-text { font-family:"Archivo Variable",ui-sans-serif,system-ui; font-size:1.75rem; font-weight:800; color:var(--rl-maroon); }
.rl-tool-card-body { padding:.875rem 1rem; flex:1; display:flex; flex-direction:column; gap:.25rem; }
.rl-tool-partner { font-size:.65rem; font-weight:700; text-transform:uppercase; letter-spacing:.1em; color:var(--rl-orange); margin:0; }
.rl-tool-name { font-family:"Archivo Variable",ui-sans-serif,system-ui; font-size:.925rem; font-weight:700; color:var(--rl-ink); margin:0; line-height:1.3; }
.rl-tool-desc { font-size:.8rem; color:var(--rl-body); line-height:1.5; margin:0; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.rl-tool-cta { display:block; padding:.625rem 1rem; font-size:.78rem; font-weight:700; color:var(--rl-maroon); border-top:1px solid var(--rl-line); background:var(--rl-bg-subtle); }
.rl-tool-open-btn { display:inline-flex; align-items:center; gap:6px; padding:9px 20px; background:var(--rl-maroon); color:#fff; border-radius:999px; font-size:.875rem; font-weight:700; text-decoration:none; transition:opacity .15s; }
.rl-tool-open-btn:hover { opacity:.85; }
.rl-filter-row { display:flex; flex-direction:column; gap:.625rem; margin-bottom:1.5rem; }
.rl-filter-group { display:flex; flex-wrap:wrap; gap:.375rem; }
.rl-filter-btn { padding:5px 13px; border:1.5px solid var(--rl-line); border-radius:999px; background:transparent; color:var(--rl-body); font-size:.78rem; font-weight:500; cursor:pointer; transition:all .15s; font-family:inherit; }
.rl-filter-btn:hover { border-color:var(--rl-maroon); color:var(--rl-maroon); }
.rl-filter-btn--active { background:var(--rl-maroon); color:#fff; border-color:var(--rl-maroon); font-weight:600; }
.rl-resources-grid { display:grid; grid-template-columns:1fr; gap:1rem; }
@media (min-width:560px) { .rl-resources-grid { grid-template-columns:repeat(2,1fr); } }
@media (min-width:900px) { .rl-resources-grid { grid-template-columns:repeat(3,1fr); } }
.rl-resource-card { display:flex; flex-direction:column; background:var(--rl-bg); border:1px solid var(--rl-line); border-radius:var(--rl-radius-lg); overflow:hidden; text-decoration:none; box-shadow:var(--rl-shadow-xs); transition:border-color .2s,transform .15s,box-shadow .15s; }
.rl-resource-card:hover { border-color:var(--rl-maroon); transform:translateY(-3px); box-shadow:var(--rl-shadow); }
.rl-resource-thumb { width:100%; aspect-ratio:16/9; background:var(--rl-bg-sunken) center/cover no-repeat; }
.rl-resource-thumb--empty { display:flex; align-items:center; justify-content:center; color:var(--rl-line-strong); }
.rl-resource-body { padding:.875rem 1rem; display:flex; flex-direction:column; gap:.3rem; flex:1; }
.rl-resource-meta { display:flex; align-items:center; gap:.5rem; margin-bottom:.25rem; flex-wrap:wrap; }
.rl-type-pill { display:inline-flex; align-items:center; gap:3px; padding:2px 8px; border-radius:999px; font-size:.64rem; font-weight:700; text-transform:uppercase; letter-spacing:.05em; }
.rl-type-pill--article { background:#e8f0fe; color:#0056d2; }
.rl-type-pill--template { background:#f0e8ff; color:#6600cc; }
.rl-type-pill--app { background:var(--rl-teal-soft); color:var(--rl-teal); }
.rl-type-pill--website { background:var(--rl-bg-subtle); color:var(--rl-body); border:1px solid var(--rl-line); }
.rl-type-pill--video { background:var(--rl-orange-soft); color:var(--rl-orange-deep); }
.rl-audience-pill { display:inline-block; padding:2px 7px; border-radius:999px; font-size:.62rem; font-weight:700; text-transform:uppercase; letter-spacing:.04em; }
.rl-audience-pill--teacher { background:var(--rl-maroon-light); color:var(--rl-maroon); }
.rl-audience-pill--student { background:var(--rl-teal-soft); color:var(--rl-teal); }
.rl-audience-pill--both { background:var(--rl-bg-subtle); color:var(--rl-body); border:1px solid var(--rl-line); }
.rl-resource-title { font-family:"Archivo Variable",ui-sans-serif,system-ui; font-size:.9rem; font-weight:700; color:var(--rl-ink); margin:0; line-height:1.3; }
.rl-resource-desc { font-size:.78rem; color:var(--rl-body); margin:0; line-height:1.5; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.rl-resource-source { font-size:.68rem; font-weight:600; color:var(--rl-body); margin-top:auto; padding-top:.375rem; }
.rl-community-layout { display:flex; flex-direction:column; gap:1.5rem; padding:1.5rem 2rem 4rem; }
@media (max-width:600px) { .rl-community-layout { padding:1.25rem 1rem 4rem; } }
@media (min-width:900px) { .rl-community-layout { flex-direction:row; align-items:flex-start; } }
.rl-community-feed { flex:1; min-width:0; display:flex; flex-direction:column; gap:.875rem; }
.rl-community-side { display:flex; flex-direction:column; gap:1rem; }
@media (min-width:900px) { .rl-community-side { width:280px; flex-shrink:0; position:sticky; top:72px; } }
.rl-comm-sidebar-card { background:var(--rl-bg); border:1px solid var(--rl-line); border-radius:var(--rl-radius-lg); padding:1.125rem; box-shadow:var(--rl-shadow-xs); }
.rl-comm-sidebar-label { font-size:.65rem; font-weight:700; text-transform:uppercase; letter-spacing:.1em; color:var(--rl-maroon); margin:0 0 .625rem; }
.rl-community-cta { display:flex; align-items:flex-start; gap:.875rem; padding:1.125rem; background:var(--rl-maroon-light); border:1px solid rgba(74,14,16,.1); border-radius:var(--rl-radius-lg); flex-wrap:wrap; }
.rl-community-cta-title { font-weight:700; font-size:.9rem; color:var(--rl-ink); margin:0 0 .2rem; }
.rl-community-cta-sub { font-size:.8rem; color:var(--rl-body); margin:0 0 .75rem; }
.rl-compose { display:flex; gap:.875rem; padding:1.125rem; background:var(--rl-bg); border:1px solid var(--rl-line); border-radius:var(--rl-radius-lg); box-shadow:var(--rl-shadow-xs); }
.rl-compose-right { flex:1; min-width:0; display:flex; flex-direction:column; gap:.5rem; }
.rl-compose-input { width:100%; padding:.625rem .875rem; background:var(--rl-bg-subtle); border:1.5px solid var(--rl-line); border-radius:var(--rl-radius-sm); color:var(--rl-ink); font-size:.875rem; outline:none; resize:none; font-family:inherit; box-sizing:border-box; transition:border-color .15s; }
.rl-compose-input:focus { border-color:var(--rl-maroon); background:var(--rl-bg); }
.rl-compose-actions { display:flex; align-items:center; justify-content:space-between; }
.rl-compose-hint { font-size:.72rem; color:var(--rl-body); }
.rl-compose-btn { display:inline-flex; align-items:center; gap:5px; padding:7px 16px; background:var(--rl-maroon); color:#fff; border:none; border-radius:999px; font-size:.82rem; font-weight:700; cursor:pointer; transition:opacity .15s; font-family:inherit; }
.rl-compose-btn:hover:not(:disabled) { opacity:.85; }
.rl-compose-btn:disabled { opacity:.45; cursor:not-allowed; }
.rl-post { display:flex; gap:.875rem; padding:1.125rem; background:var(--rl-bg); border:1px solid var(--rl-line); border-radius:var(--rl-radius-lg); box-shadow:var(--rl-shadow-xs); }
.rl-post-body { flex:1; min-width:0; }
.rl-post-hd { display:flex; align-items:flex-start; justify-content:space-between; gap:.5rem; margin-bottom:.5rem; }
.rl-post-author { font-size:.875rem; font-weight:700; color:var(--rl-ink); }
.rl-post-school { font-size:.8rem; font-weight:400; color:var(--rl-body); }
.rl-post-time { font-size:.7rem; color:var(--rl-body); white-space:nowrap; flex-shrink:0; }
.rl-post-content { font-size:.9rem; line-height:1.6; color:var(--rl-ink); margin:0 0 .75rem; }
.rl-post-actions { display:flex; gap:.75rem; }
.rl-post-action { display:inline-flex; align-items:center; gap:5px; font-size:.8rem; font-weight:600; color:var(--rl-body); background:transparent; border:none; cursor:pointer; text-decoration:none; padding:4px 0; transition:color .15s; font-family:inherit; }
.rl-post-action:hover { color:var(--rl-maroon); }
.rl-post-action--liked { color:#e11d48 !important; }
.rl-player-layout { display:flex; flex-direction:column; max-width:1200px; margin:0 auto; padding:1.5rem 2rem 4rem; gap:2rem; }
@media (max-width:600px) { .rl-player-layout { padding:1rem 1rem 3rem; } }
@media (min-width:960px) { .rl-player-layout { flex-direction:row; align-items:flex-start; } }
.rl-player-main { flex:1; min-width:0; display:flex; flex-direction:column; gap:0; }
.rl-player-wrap { width:100%; border-radius:var(--rl-radius-lg); overflow:hidden; box-shadow:var(--rl-shadow-lg); background:#000; }
.rl-player-wrap iframe { display:block; width:100%; aspect-ratio:16/9; border:none; }
.rl-player-info { background:var(--rl-bg); border:1px solid var(--rl-line); border-top:none; border-radius:0 0 var(--rl-radius-lg) var(--rl-radius-lg); padding:1.25rem 1.5rem 1.5rem; }
.rl-player-info-top { display:flex; align-items:center; gap:.75rem; margin-bottom:.375rem; flex-wrap:wrap; }
.rl-player-title { font-family:"Archivo Variable",ui-sans-serif,system-ui; font-size:clamp(1.1rem,2.5vw,1.5rem); font-weight:800; color:var(--rl-ink); margin:0 0 .375rem; letter-spacing:-.02em; }
.rl-player-desc { font-size:.875rem; line-height:1.65; color:var(--rl-body); margin:0; }
.rl-player-actions { margin-top:.875rem; display:flex; align-items:center; gap:.875rem; flex-wrap:wrap; }
.rl-complete-btn { display:flex; align-items:center; gap:6px; padding:8px 16px; border-radius:999px; font-size:.82rem; font-weight:700; cursor:pointer; border:2px solid var(--rl-line-strong,#c4c4c4); background:transparent; color:var(--rl-body); transition:all .2s; font-family:inherit; }
.rl-complete-btn:hover { border-color:var(--rl-teal); color:var(--rl-teal); background:var(--rl-teal-soft); }
.rl-complete-btn--done { border-color:var(--rl-teal) !important; color:var(--rl-teal) !important; background:var(--rl-teal-soft) !important; }
.rl-player-side { display:none; flex-direction:column; gap:1rem; }
@media (min-width:960px) { .rl-player-side { display:flex; width:300px; flex-shrink:0; position:sticky; top:72px; max-height:calc(100vh - 92px); overflow-y:auto; } }
.rl-player-sidebar-card { background:var(--rl-bg); border:1px solid var(--rl-line); border-radius:var(--rl-radius-lg); padding:1.125rem; display:flex; flex-direction:column; gap:.25rem; box-shadow:var(--rl-shadow-xs); }
.rl-player-sidebar-label { font-size:.64rem; font-weight:700; text-transform:uppercase; letter-spacing:.1em; color:var(--rl-maroon); margin:0 0 .5rem; }
.rl-player-sidebar-title { font-family:"Archivo Variable",ui-sans-serif,system-ui; font-size:.9rem; font-weight:700; color:var(--rl-ink); margin:0; line-height:1.3; }
.rl-lessons-mobile { margin-top:1.25rem; background:var(--rl-bg-subtle); border:1px solid var(--rl-line); border-radius:var(--rl-radius-lg); padding:1rem; }
@media (min-width:960px) { .rl-lessons-mobile { display:none; } }
.rl-lesson-list { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:2px; }
.rl-lesson-btn { display:flex; align-items:flex-start; gap:.5rem; width:100%; padding:.5rem .625rem; border:1px solid transparent; border-radius:var(--rl-radius-sm); background:transparent; text-align:left; cursor:pointer; transition:background .15s; font-family:inherit; }
.rl-lesson-btn:hover { background:var(--rl-bg-subtle); }
.rl-lesson-btn--active { background:var(--rl-maroon-light) !important; border-color:var(--rl-maroon) !important; }
.rl-lesson-num { font-size:.68rem; font-weight:800; color:var(--rl-maroon); min-width:16px; padding-top:1px; flex-shrink:0; }
.rl-lesson-label { font-size:.82rem; font-weight:500; color:var(--rl-ink); line-height:1.35; }
.rl-related-list { display:flex; flex-direction:column; gap:.375rem; }
.rl-related-item { display:flex; align-items:center; gap:.75rem; padding:.5rem .75rem; background:var(--rl-bg-subtle); border:1px solid var(--rl-line); border-radius:var(--rl-radius-sm); text-decoration:none; transition:border-color .15s; }
.rl-related-item:hover { border-color:var(--rl-maroon); }
.rl-related-source { font-size:.62rem; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:var(--rl-orange); flex-shrink:0; }
.rl-related-name { font-size:.82rem; font-weight:600; color:var(--rl-ink); flex:1; line-height:1.3; }
.rl-related-dur { font-size:.7rem; color:var(--rl-body); flex-shrink:0; }
.rl-related-all { display:block; font-size:.8rem; font-weight:600; color:var(--rl-maroon); text-decoration:none; margin-top:.75rem; }
.rl-sidebar-divider { height:1px; background:var(--rl-line); margin:.75rem 0; }
.rl-frame-wrap { width:100%; }
.rl-frame-iframe { display:block; width:100%; aspect-ratio:16/9; border:none; }
.rl-frame-loading { display:flex; align-items:center; gap:.875rem; justify-content:center; padding:4rem; background:#0d0d0d; font-size:.875rem; color:rgba(255,255,255,.45); aspect-ratio:16/9; }
.rl-frame-spinner { width:22px; height:22px; border:2px solid rgba(255,255,255,.15); border-top-color:var(--rl-orange); border-radius:50%; animation:rl-spin 1s linear infinite; }
.rl-frame-attr { display:flex; justify-content:space-between; align-items:center; padding:.5rem 1rem; background:#0a0a0a; border-top:1px solid rgba(255,255,255,.06); font-size:.72rem; color:rgba(255,255,255,.3); gap:.5rem; flex-wrap:wrap; }
.rl-frame-attr-link { display:flex; align-items:center; gap:4px; color:var(--rl-orange); text-decoration:none; font-weight:600; }
.rl-frame-fallback { display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:4rem 2rem; gap:.75rem; background:#111; aspect-ratio:16/9; }
.rl-frame-fallback h3 { font-size:1rem; font-weight:700; color:#fff; margin:0; }
.rl-frame-fallback p { font-size:.84rem; color:rgba(255,255,255,.45); max-width:340px; margin:0; }
.rl-admin-page { padding:1.5rem 2rem 4rem; }
@media (max-width:600px) { .rl-admin-page { padding:1.25rem 1rem 4rem; } }
.rl-admin-gate { max-width:400px; margin:4rem auto; padding:2rem; background:var(--rl-bg); border:1px solid var(--rl-line); border-radius:var(--rl-radius-lg); box-shadow:var(--rl-shadow-lg); }
.rl-admin-gate-title { font-family:"Archivo Variable",ui-sans-serif,system-ui; font-size:1.5rem; font-weight:800; color:var(--rl-ink); margin:.375rem 0 1.125rem; }
.rl-admin-gate-form { display:flex; flex-direction:column; gap:.75rem; }
.rl-admin-hd { display:flex; align-items:flex-start; justify-content:space-between; gap:1rem; margin-bottom:2rem; flex-wrap:wrap; }
.rl-admin-title { font-family:"Archivo Variable",ui-sans-serif,system-ui; font-size:1.875rem; font-weight:800; color:var(--rl-ink); margin:.25rem 0 0; }
.rl-admin-btns { display:flex; gap:.625rem; flex-wrap:wrap; }
.rl-admin-btn-primary { display:inline-flex; align-items:center; gap:6px; padding:8px 18px; background:var(--rl-maroon); color:#fff; border:none; border-radius:999px; font-size:.84rem; font-weight:700; cursor:pointer; transition:opacity .15s; white-space:nowrap; text-decoration:none; font-family:inherit; }
.rl-admin-btn-primary:hover { opacity:.85; }
.rl-admin-btn-secondary { display:inline-flex; align-items:center; gap:6px; padding:8px 18px; background:transparent; color:var(--rl-ink); border:1.5px solid var(--rl-line); border-radius:999px; font-size:.84rem; font-weight:700; cursor:pointer; transition:border-color .15s; white-space:nowrap; font-family:inherit; text-decoration:none; }
.rl-admin-btn-secondary:hover { border-color:var(--rl-maroon); color:var(--rl-maroon); }
.rl-admin-tabs { display:flex; gap:0; border-bottom:2px solid var(--rl-line); margin-bottom:2rem; overflow-x:auto; scrollbar-width:none; }
.rl-admin-tabs::-webkit-scrollbar { display:none; }
.rl-admin-tab { display:flex; align-items:center; gap:6px; padding:.75rem 1.25rem; border:none; border-bottom:2px solid transparent; margin-bottom:-2px; background:transparent; color:var(--rl-body); font-size:.875rem; font-weight:600; cursor:pointer; white-space:nowrap; transition:color .15s; font-family:inherit; text-decoration:none; }
.rl-admin-tab:hover { color:var(--rl-maroon); }
.rl-admin-tab--active { color:var(--rl-maroon); border-bottom-color:var(--rl-maroon); }
.rl-admin-tab-count { display:inline-flex; align-items:center; justify-content:center; min-width:20px; height:20px; padding:0 6px; background:var(--rl-bg-subtle); border-radius:999px; font-size:.68rem; font-weight:700; color:var(--rl-body); }
.rl-admin-tab--active .rl-admin-tab-count { background:var(--rl-maroon-light); color:var(--rl-maroon); }
.rl-admin-field { display:flex; flex-direction:column; gap:5px; }
.rl-admin-label { font-size:.68rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--rl-body); }
.rl-admin-input { width:100%; height:40px; padding:0 12px; background:var(--rl-bg-subtle); border:1.5px solid var(--rl-line); border-radius:var(--rl-radius-sm); color:var(--rl-ink); font-size:.875rem; outline:none; transition:border-color .15s; font-family:inherit; box-sizing:border-box; }
.rl-admin-input:focus { border-color:var(--rl-maroon); background:var(--rl-bg); }
.rl-admin-textarea { height:80px !important; padding:10px 12px !important; resize:vertical; }
.rl-admin-err { font-size:.8rem; font-weight:700; color:#dc2626; margin:0; }
.rl-admin-submit { height:42px; background:var(--rl-maroon); color:#fff; border:none; border-radius:999px; font-size:.875rem; font-weight:700; cursor:pointer; font-family:inherit; transition:opacity .15s; }
.rl-admin-submit:hover { opacity:.85; }
.rl-admin-form-card { background:var(--rl-bg-subtle); border:1px solid var(--rl-line); border-radius:var(--rl-radius-lg); padding:1.5rem; margin-bottom:1.5rem; }
.rl-admin-form-title { font-family:"Archivo Variable",ui-sans-serif,system-ui; font-size:1.05rem; font-weight:700; color:var(--rl-ink); margin:0 0 1.125rem; }
.rl-admin-form-grid { display:grid; grid-template-columns:1fr; gap:.875rem; }
@media (min-width:600px) { .rl-admin-form-grid { grid-template-columns:1fr 1fr; } }
.rl-admin-form-actions { display:flex; justify-content:flex-end; gap:.625rem; margin-top:1rem; }
.rl-admin-save { display:flex; align-items:center; gap:6px; padding:8px 20px; background:var(--rl-maroon); color:#fff; border:none; border-radius:999px; font-size:.84rem; font-weight:700; cursor:pointer; transition:opacity .15s; font-family:inherit; }
.rl-admin-save:disabled { opacity:.5; cursor:not-allowed; }
.rl-admin-save:not(:disabled):hover { opacity:.85; }
.rl-admin-cancel { padding:8px 20px; background:transparent; color:var(--rl-body); border:1.5px solid var(--rl-line); border-radius:999px; font-size:.84rem; font-weight:700; cursor:pointer; font-family:inherit; }
.rl-admin-cancel:hover { border-color:var(--rl-maroon); color:var(--rl-maroon); }
.rl-admin-icon-btn { display:flex; align-items:center; justify-content:center; width:30px; height:30px; border:1px solid var(--rl-line); border-radius:7px; background:transparent; color:var(--rl-body); cursor:pointer; transition:all .15s; text-decoration:none; flex-shrink:0; font-family:inherit; }
.rl-admin-icon-btn:hover { border-color:var(--rl-ink-soft,#3c3d3f); color:var(--rl-ink); }
.rl-admin-icon-btn--danger:hover { border-color:#ef4444; color:#ef4444; background:#fef2f2; }
.rl-admin-cat-block { border:1px solid var(--rl-line); border-radius:var(--rl-radius-lg); overflow:hidden; margin-bottom:1.25rem; box-shadow:var(--rl-shadow-xs); }
.rl-admin-cat-hd { display:flex; align-items:flex-start; gap:.875rem; padding:1.125rem 1.25rem; border-bottom:1px solid var(--rl-line); background:var(--rl-bg); }
.rl-admin-cat-icon { font-size:1.5rem; flex-shrink:0; }
.rl-admin-cat-text { flex:1; min-width:0; }
.rl-admin-cat-title { font-family:"Archivo Variable",ui-sans-serif,system-ui; font-size:1rem; font-weight:700; color:var(--rl-ink); margin:0 0 .2rem; }
.rl-admin-cat-desc { font-size:.8rem; color:var(--rl-body); margin:0; }
.rl-admin-cat-count { font-size:.72rem; font-weight:600; color:var(--rl-body); margin-top:.25rem; }
.rl-admin-cat-actions { display:flex; gap:5px; flex-shrink:0; }
.rl-admin-course-grid { display:grid; grid-template-columns:1fr; gap:.875rem; padding:1.125rem; background:var(--rl-bg-subtle); }
@media (min-width:560px) { .rl-admin-course-grid { grid-template-columns:repeat(2,1fr); } }
@media (min-width:900px) { .rl-admin-course-grid { grid-template-columns:repeat(3,1fr); } }
.rl-admin-course-card { background:var(--rl-bg); border:1px solid var(--rl-line); border-radius:var(--rl-radius-lg); overflow:hidden; display:flex; flex-direction:column; transition:border-color .15s; box-shadow:var(--rl-shadow-xs); }
.rl-admin-course-card:hover { border-color:var(--rl-maroon); }
.rl-admin-course-thumb { width:100%; aspect-ratio:16/9; overflow:hidden; background:var(--rl-bg-sunken); }
.rl-admin-course-thumb img { width:100%; height:100%; object-fit:cover; display:block; }
.rl-admin-course-thumb--empty { display:flex; align-items:center; justify-content:center; }
.rl-admin-course-body { padding:.75rem .875rem; flex:1; display:flex; flex-direction:column; gap:.25rem; }
.rl-admin-course-top { display:flex; align-items:center; justify-content:space-between; gap:.5rem; }
.rl-admin-course-source { font-size:.62rem; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:var(--rl-orange); }
.rl-admin-course-type-badge { font-size:.62rem; font-weight:600; color:var(--rl-body); background:var(--rl-bg-sunken); padding:2px 6px; border-radius:999px; }
.rl-admin-course-title { font-family:"Archivo Variable",ui-sans-serif,system-ui; font-size:.875rem; font-weight:700; color:var(--rl-ink); margin:0; line-height:1.3; }
.rl-admin-course-desc { font-size:.76rem; color:var(--rl-body); margin:0; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.rl-admin-course-actions { display:flex; align-items:center; gap:4px; padding:.5rem .875rem; border-top:1px solid var(--rl-line); background:var(--rl-bg-subtle); flex-wrap:wrap; }
.rl-admin-course-action { display:inline-flex; align-items:center; gap:3px; padding:3px 9px; border:1px solid var(--rl-line); border-radius:6px; background:var(--rl-bg); color:var(--rl-body); font-size:.7rem; font-weight:600; cursor:pointer; transition:all .15s; text-decoration:none; font-family:inherit; }
.rl-admin-course-action:hover { border-color:var(--rl-ink-soft,#3c3d3f); color:var(--rl-ink); }
.rl-admin-course-action--danger:hover { border-color:#ef4444; color:#ef4444; background:#fef2f2; }
.rl-admin-add-card { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:.5rem; min-height:140px; border:2px dashed var(--rl-line-strong); border-radius:var(--rl-radius-lg); color:var(--rl-body); text-decoration:none; font-size:.84rem; font-weight:600; transition:border-color .15s,color .15s; cursor:pointer; background:transparent; font-family:inherit; }
.rl-admin-add-card:hover { border-color:var(--rl-maroon); color:var(--rl-maroon); }
.rl-admin-add-lesson-btn { display:flex; align-items:center; gap:4px; padding:5px 10px; background:transparent; border:1px dashed var(--rl-line-strong); border-radius:var(--rl-radius-sm); color:var(--rl-body); font-size:.78rem; font-weight:600; cursor:pointer; transition:border-color .15s,color .15s; align-self:flex-start; font-family:inherit; }
.rl-admin-add-lesson-btn:hover { border-color:var(--rl-maroon); color:var(--rl-maroon); }
.rl-admin-lesson-row { display:flex; align-items:center; gap:.5rem; padding:4px 0; }
.rl-admin-lesson-num { font-size:.68rem; font-weight:800; color:var(--rl-maroon); width:18px; flex-shrink:0; }
.rl-admin-lesson-title { font-size:.8rem; color:var(--rl-ink); flex:1; }
.rl-admin-overlay { position:fixed; inset:0; background:rgba(0,0,0,.45); display:flex; align-items:flex-end; justify-content:center; z-index:100; }
@media (min-width:600px) { .rl-admin-overlay { align-items:center; padding:20px; } }
.rl-admin-modal { background:var(--rl-bg); border-radius:var(--rl-radius-xl) var(--rl-radius-xl) 0 0; padding:1.75rem; width:100%; max-height:92vh; overflow-y:auto; box-shadow:var(--rl-shadow-lg); }
@media (min-width:600px) { .rl-admin-modal { border-radius:var(--rl-radius-xl); max-width:560px; } }
.rl-admin-modal-hd { display:flex; align-items:center; justify-content:space-between; margin-bottom:1.25rem; }
.rl-profile-body { display:flex; flex-direction:column; gap:2rem; padding:1.5rem 2rem 4rem; }
@media (min-width:860px) { .rl-profile-body { flex-direction:row; align-items:flex-start; } }
@media (max-width:600px) { .rl-profile-body { padding:1.25rem 1rem 4rem; } }
.rl-profile-existing { flex:1; min-width:0; }
.rl-profile-existing-label { font-size:.68rem; font-weight:700; text-transform:uppercase; letter-spacing:.1em; color:var(--rl-body); margin:0 0 .875rem; }
.rl-profile-existing-list { display:flex; flex-direction:column; gap:.5rem; }
.rl-profile-existing-item { display:flex; align-items:center; gap:.5rem; background:var(--rl-bg); border:1.5px solid var(--rl-line); border-radius:var(--rl-radius-lg); overflow:hidden; box-shadow:var(--rl-shadow-xs); }
.rl-profile-existing-item--active { border-color:var(--rl-maroon); }
.rl-profile-existing-btn { display:flex; align-items:center; gap:.875rem; flex:1; padding:.875rem 1rem; background:transparent; border:none; cursor:pointer; text-align:left; transition:background .15s; font-family:inherit; }
.rl-profile-existing-btn:hover { background:var(--rl-bg-subtle); }
.rl-profile-existing-name { font-size:.9rem; font-weight:700; color:var(--rl-ink); display:block; margin:0 0 .1rem; }
.rl-profile-existing-sub { font-size:.75rem; color:var(--rl-body); display:block; }
.rl-profile-active-badge { display:inline-flex; align-items:center; gap:4px; padding:3px 9px; background:var(--rl-maroon-light); color:var(--rl-maroon); border-radius:999px; font-size:.68rem; font-weight:700; margin-left:auto; white-space:nowrap; }
.rl-profile-form-wrap { flex:1; min-width:0; background:var(--rl-bg); border:1px solid var(--rl-line); border-radius:var(--rl-radius-lg); padding:1.5rem; box-shadow:var(--rl-shadow-xs); }
.rl-profile-form-title { font-family:"Archivo Variable",ui-sans-serif,system-ui; font-size:1.1rem; font-weight:700; color:var(--rl-ink); margin:0 0 1.25rem; }
.rl-profile-preview { display:flex; align-items:center; gap:1rem; margin-bottom:1.5rem; padding:1rem; background:var(--rl-bg-subtle); border-radius:var(--rl-radius); }
.rl-profile-preview-name { font-weight:700; font-size:.95rem; color:var(--rl-ink); margin:0 0 .2rem; }
.rl-profile-preview-sub { font-size:.8rem; color:var(--rl-body); margin:0; }
.rl-profile-preview-hint { font-size:.68rem; color:var(--rl-body); margin:.25rem 0 0; opacity:.65; }
.rl-profile-form { display:flex; flex-direction:column; gap:1.125rem; }
.rl-add-page { padding:1.5rem 2rem 4rem; }
@media (max-width:600px) { .rl-add-page { padding:1.25rem 1rem 4rem; } }
.rl-add-back { display:inline-flex; align-items:center; gap:6px; font-size:.82rem; font-weight:600; color:var(--rl-body); text-decoration:none; margin-bottom:1.5rem; transition:color .15s; }
.rl-add-back:hover { color:var(--rl-maroon); }
.rl-add-layout { display:flex; flex-direction:column; gap:2rem; }
@media (min-width:900px) { .rl-add-layout { flex-direction:row; align-items:flex-start; } }
.rl-add-form-col { flex:1; min-width:0; }
.rl-add-thumb-col { width:100%; }
@media (min-width:900px) { .rl-add-thumb-col { width:280px; flex-shrink:0; position:sticky; top:72px; } }
.rl-add-title { font-family:"Archivo Variable",ui-sans-serif,system-ui; font-size:clamp(1.375rem,3.5vw,1.875rem); font-weight:800; color:var(--rl-ink); margin:0 0 .375rem; letter-spacing:-.02em; }
.rl-add-sub { font-size:.875rem; color:var(--rl-body); margin:0 0 1.75rem; line-height:1.6; }
.rl-add-section { margin-bottom:1.125rem; display:flex; flex-direction:column; gap:5px; }
.rl-add-row { display:flex; gap:1rem; }
@media (max-width:600px) { .rl-add-row { flex-direction:column; } }
.rl-add-input { width:100%; height:42px; padding:0 12px; background:var(--rl-bg-subtle); border:1.5px solid var(--rl-line); border-radius:var(--rl-radius-sm); color:var(--rl-ink); font-size:.875rem; outline:none; transition:border-color .15s; font-family:inherit; box-sizing:border-box; }
.rl-add-input:focus { border-color:var(--rl-maroon); background:var(--rl-bg); }
.rl-add-textarea { height:88px !important; padding:10px 12px !important; resize:vertical; }
.rl-add-hint { font-size:.72rem; color:var(--rl-body); margin:2px 0 0; }
.rl-add-error { padding:.75rem 1rem; background:var(--rl-maroon-light); color:var(--rl-maroon); border-radius:var(--rl-radius-sm); font-size:.84rem; font-weight:600; margin-bottom:1.25rem; }
.rl-add-save { display:flex; align-items:center; justify-content:center; gap:6px; width:
100%; height:46px; background:var(--rl-maroon); color:#fff; border:none; border-radius:999px; font-size:.9rem; font-weight:700; cursor:pointer; transition:opacity .15s; margin-top:.625rem; font-family:inherit; }
.rl-add-save:hover:not(:disabled) { opacity:.85; }
.rl-add-save:disabled { opacity:.5; cursor:not-allowed; }
.rl-type-row { display:flex; gap:.5rem; flex-wrap:wrap; }
.rl-type-btn { display:flex; align-items:center; gap:5px; padding:7px 14px; border:1.5px solid var(--rl-line); border-radius:var(--rl-radius-sm); background:transparent; color:var(--rl-body); font-size:.82rem; font-weight:600; cursor:pointer; transition:all .15s; font-family:inherit; }
.rl-type-btn--active { border-color:var(--rl-maroon); background:var(--rl-maroon-light); color:var(--rl-maroon); }
.rl-lesson-inputs { display:flex; flex-direction:column; gap:.75rem; }
.rl-lesson-input-row { display:flex; align-items:flex-start; gap:.75rem; }
.rl-lesson-input-num { font-size:.72rem; font-weight:800; color:var(--rl-maroon); padding-top:13px; min-width:18px; flex-shrink:0; }
.rl-lesson-input-fields { flex:1; min-width:0; display:flex; flex-direction:column; gap:6px; }
.rl-thumb-drop { width:100%; aspect-ratio:16/9; border:2px dashed var(--rl-line-strong); border-radius:var(--rl-radius); cursor:pointer; overflow:hidden; transition:border-color .15s; display:flex; align-items:center; justify-content:center; background:var(--rl-bg-subtle); }
.rl-thumb-drop:hover,.rl-thumb-drop--over { border-color:var(--rl-maroon); background:var(--rl-maroon-light); }
.rl-thumb-preview { width:100%; height:100%; object-fit:cover; display:block; }
.rl-thumb-empty { display:flex; flex-direction:column; align-items:center; gap:.5rem; color:var(--rl-body); text-align:center; padding:1rem; }
.rl-thumb-empty p { font-size:.84rem; font-weight:600; margin:0; }
.rl-thumb-empty span { font-size:.72rem; opacity:.65; }
.rl-thumb-clear { margin-top:.5rem; font-size:.78rem; color:var(--rl-body); background:transparent; border:none; cursor:pointer; text-decoration:underline; font-family:inherit; }
.rl-toast { position:fixed; bottom:72px; left:50%; transform:translateX(-50%); background:var(--rl-ink); color:#fff; padding:10px 20px; border-radius:999px; font-size:.84rem; font-weight:600; z-index:200; box-shadow:var(--rl-shadow-lg); white-space:nowrap; animation:rl-fadein .2s ease; }
@media (min-width:900px) { .rl-toast { bottom:28px; } }
@keyframes rl-fadein { from { opacity:0; transform:translateX(-50%) translateY(8px); } }
@media (prefers-reduced-motion:reduce) { .rl-course-card,.rl-tool-card,.rl-resource-card,.rl-quicklink,.rl-metric-card { transition:none !important; transform:none !important; } .rl-spin { animation:none !important; } }
`;
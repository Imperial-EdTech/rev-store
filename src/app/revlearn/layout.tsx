"use client";

import { RevLearnProviders } from "@/components/revlearn/shell";

export default function RevLearnLayout({ children }: { children: React.ReactNode }) {
  return (
    <RevLearnProviders>
      <style>{CSS}</style>
      {children}
    </RevLearnProviders>
  );
}

const CSS = `
:root {
  --rl-orange: #FF6B1A; --rl-orange-deep: #e05510; --rl-orange-soft: #fff1ea;
  --rl-maroon: #4a0e10; --rl-maroon-soft: #f9eaea;
  --rl-teal: #0d7b6b; --rl-teal-soft: #e0f7f4;
  --rl-bg: #ffffff; --rl-bg-subtle: #f7f4f2; --rl-bg-sunken: #f0ebe8;
  --rl-ink: #1a1210; --rl-ink-soft: #3d2f2d; --rl-body: #6b5650;
  --rl-line: #e8e0de; --rl-line-strong: #d6cbc8;
  --rl-sidebar-w: 220px; --rl-header-h: 56px; --rl-bottom-h: 64px;
  --rl-radius-sm: 8px; --rl-radius: 14px; --rl-radius-lg: 20px;
  --rl-shadow: 0 1px 3px rgba(0,0,0,.07), 0 4px 16px rgba(0,0,0,.05);
  --rl-shadow-lg: 0 8px 40px rgba(0,0,0,.12);
}
[data-rl="dark"] {
  --rl-bg: #150f0e; --rl-bg-subtle: #1e1514; --rl-bg-sunken: #2a1b19;
  --rl-ink: #f5edea; --rl-ink-soft: #e0d0cc; --rl-body: #b09890;
  --rl-line: #3a2826; --rl-line-strong: #4a3230;
  --rl-orange-soft: #2a1205; --rl-maroon-soft: #200c0e; --rl-teal-soft: #061f1b;
  --rl-shadow: 0 1px 3px rgba(0,0,0,.3), 0 4px 16px rgba(0,0,0,.2);
}
.rl-app { min-height: 100vh; background: var(--rl-bg); color: var(--rl-ink); font-family: "Inter Variable", ui-sans-serif, system-ui; transition: background .2s, color .2s; }
.rl-spin { animation: rl-spin 1s linear infinite; }
@keyframes rl-spin { to { transform: rotate(360deg); } }
.rl-state-center { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: .75rem; padding: 4rem 1rem; color: var(--rl-body); font-size: .875rem; }
.rl-logo-rev  { font-family: "Archivo Variable", ui-sans-serif, system-ui; font-weight: 300; font-size: inherit; color: var(--rl-ink); letter-spacing: -.02em; }
.rl-logo-learn { font-family: "Archivo Variable", ui-sans-serif, system-ui; font-weight: 800; font-size: inherit; color: var(--rl-orange); letter-spacing: -.02em; }
.rl-shell { display: flex; min-height: 100vh; }
.rl-shell-main { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.rl-shell-content { flex: 1; overflow-x: hidden; padding-bottom: var(--rl-bottom-h); }
@media (min-width: 860px) { .rl-shell-content { padding-bottom: 0; } }
.rl-sidebar { width: var(--rl-sidebar-w); flex-shrink: 0; background: var(--rl-bg-subtle); border-right: 1px solid var(--rl-line); display: none; flex-direction: column; position: sticky; top: 0; height: 100vh; overflow-y: auto; padding: 1.25rem 0; }
@media (min-width: 860px) { .rl-sidebar { display: flex; } }
.rl-sidebar-logo { display: block; font-size: 1.2rem; padding: 0 1.25rem .25rem; }
.rl-sidebar-tagline { font-size: .56rem; font-weight: 500; letter-spacing: .05em; color: var(--rl-body); text-transform: uppercase; padding: 0 1.25rem; margin-bottom: 1.5rem; line-height: 1; }
.rl-sidebar-nav { display: flex; flex-direction: column; gap: 2px; padding: 0 .75rem; flex: 1; }
.rl-sidebar-link { display: flex; align-items: center; gap: .75rem; padding: .625rem .875rem; border-radius: var(--rl-radius-sm); text-decoration: none; font-size: .875rem; font-weight: 500; color: var(--rl-body); transition: background .15s, color .15s; }
.rl-sidebar-link:hover { background: var(--rl-bg-sunken); color: var(--rl-ink); }
.rl-sidebar-link--active { background: var(--rl-orange-soft) !important; color: var(--rl-orange-deep) !important; font-weight: 700; }
[data-rl="dark"] .rl-sidebar-link--active { color: var(--rl-orange) !important; }
.rl-sidebar-profile { padding: 1rem .75rem 0; border-top: 1px solid var(--rl-line); margin-top: auto; }
.rl-sidebar-profile-link { display: flex; align-items: center; gap: .75rem; text-decoration: none; padding: .625rem; border-radius: var(--rl-radius-sm); transition: background .15s; }
.rl-sidebar-profile-link:hover { background: var(--rl-bg-sunken); }
.rl-sidebar-profile-text { display: flex; flex-direction: column; min-width: 0; }
.rl-sidebar-profile-name { font-size: .84rem; font-weight: 700; color: var(--rl-ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.rl-sidebar-profile-school { font-size: .72rem; color: var(--rl-body); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.rl-sidebar-setup-link { display: flex; align-items: center; gap: .5rem; text-decoration: none; font-size: .82rem; font-weight: 600; color: var(--rl-orange); padding: .625rem; }
.rl-header { height: var(--rl-header-h); background: var(--rl-bg); border-bottom: 1px solid var(--rl-line); position: sticky; top: 0; z-index: 40; }
.rl-header-inner { display: flex; align-items: center; gap: .75rem; height: 100%; padding: 0 1.25rem; }
.rl-logo { display: flex; align-items: baseline; font-size: 1.15rem; }
.rl-header-tagline { font-size: .58rem; font-weight: 500; letter-spacing: .05em; color: var(--rl-body); text-transform: uppercase; display: none; }
@media (min-width: 600px) { .rl-header-tagline { display: block; } }
.rl-header-right { display: flex; align-items: center; gap: 6px; margin-left: auto; }
.rl-hbtn { display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border: 1px solid var(--rl-line); border-radius: var(--rl-radius-sm); background: transparent; color: var(--rl-body); cursor: pointer; transition: all .15s; text-decoration: none; flex-shrink: 0; }
.rl-hbtn:hover { color: var(--rl-orange); border-color: var(--rl-orange); background: var(--rl-orange-soft); }
.rl-site-btn { font-size: .68rem; font-weight: 700; letter-spacing: .06em; color: var(--rl-body); text-decoration: none; padding: 4px 10px; border: 1px solid var(--rl-line); border-radius: 999px; white-space: nowrap; transition: all .15s; display: none; }
@media (min-width: 600px) { .rl-site-btn { display: inline-block; } }
.rl-site-btn:hover { color: var(--rl-maroon); border-color: var(--rl-maroon); }
.rl-bottom-nav { display: flex; position: fixed; bottom: 0; left: 0; right: 0; height: var(--rl-bottom-h); background: var(--rl-bg); border-top: 1px solid var(--rl-line); z-index: 40; }
@media (min-width: 860px) { .rl-bottom-nav { display: none; } }
.rl-bottom-link { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; text-decoration: none; color: var(--rl-body); font-size: .6rem; font-weight: 600; letter-spacing: .02em; transition: color .15s; }
.rl-bottom-link--active { color: var(--rl-orange); }
.rl-page { display: flex; flex-direction: column; }
.rl-page-hero { background: var(--rl-maroon); padding: 2.5rem 1.5rem; position: relative; overflow: hidden; }
.rl-page-hero::before { content: ""; position: absolute; inset: 0; background: radial-gradient(120% 80% at 70% 0%, #7a1a1e 0%, #4a0e10 60%, #2e0608 100%); pointer-events: none; }
.rl-page-hero > * { position: relative; z-index: 1; }
.rl-page-kicker { font-size: .68rem; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; color: var(--rl-orange); margin: 0 0 .5rem; }
.rl-page-title { font-family: "Archivo Variable", ui-sans-serif, system-ui; font-size: clamp(1.4rem, 4vw, 2.25rem); font-weight: 800; color: #fff; margin: 0 0 .5rem; letter-spacing: -.02em; line-height: 1.15; }
.rl-page-sub { color: rgba(255,255,255,.6); font-size: .9rem; margin: 0 0 1.25rem; max-width: 520px; }
.rl-page-search { display: block; width: 100%; max-width: 440px; height: 42px; padding: 0 14px; background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.2); border-radius: 999px; color: #fff; font-size: .875rem; outline: none; box-sizing: border-box; }
.rl-page-search::placeholder { color: rgba(255,255,255,.45); }
.rl-page-search:focus { background: rgba(255,255,255,.18); }
.rl-page-body { padding: 1.75rem 1.5rem 4rem; }
.rl-cat-section { margin-bottom: 2.5rem; }
.rl-section-title { font-family: "Archivo Variable", ui-sans-serif, system-ui; font-size: 1rem; font-weight: 700; color: var(--rl-ink); margin: 0 0 1rem; display: flex; align-items: center; gap: .4rem; }
.rl-section-row { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; margin-bottom: .875rem; }
.rl-cat-count { font-size: .72rem; font-weight: 600; color: var(--rl-body); }
.rl-cat-desc { font-size: .84rem; color: var(--rl-body); margin: 0 0 .875rem; }
.rl-empty { text-align: center; padding: 3rem 1rem; color: var(--rl-body); }
.rl-empty a { color: var(--rl-orange); }
.rl-empty-icon { font-size: 2rem; margin: 0 0 .5rem; }
.rl-empty-cat { font-size: .84rem; color: var(--rl-body); font-style: italic; }
.rl-error-box { display: flex; gap: 1rem; padding: 1rem 1.25rem; background: var(--rl-maroon-soft); border: 1px solid rgba(74,14,16,.15); border-radius: var(--rl-radius); color: var(--rl-maroon); margin: 1rem 0; }
[data-rl="dark"] .rl-error-box { color: #f87171; }
.rl-error-title { font-weight: 700; margin: 0 0 .2rem; }
.rl-error-body { font-size: .84rem; margin: 0; opacity: .8; }
.rl-retry-btn { margin-top: .5rem; padding: 5px 12px; background: var(--rl-maroon); color: #fff; border: none; border-radius: 999px; font-size: .78rem; font-weight: 700; cursor: pointer; text-decoration: none; display: inline-block; }
.rl-clear { font-size: .78rem; font-weight: 600; color: var(--rl-orange); text-decoration: none; background: none; border: none; cursor: pointer; }
.rl-source-pill { display: inline-block; padding: 3px 9px; background: var(--rl-orange-soft); color: var(--rl-orange-deep); border-radius: 999px; font-size: .68rem; font-weight: 700; letter-spacing: .04em; }
[data-rl="dark"] .rl-source-pill { color: var(--rl-orange); }
.rl-tags { display: flex; flex-wrap: wrap; gap: 4px; }
.rl-tag { display: inline-block; padding: 2px 7px; background: var(--rl-bg-sunken); color: var(--rl-body); font-size: .65rem; font-weight: 600; border-radius: 999px; border: 1px solid var(--rl-line); }
.rl-breadcrumb { display: flex; align-items: center; gap: 5px; font-size: .75rem; color: var(--rl-body); margin-bottom: 1.25rem; flex-wrap: wrap; }
.rl-breadcrumb a { color: var(--rl-orange); text-decoration: none; }
.rl-breadcrumb a:hover { text-decoration: underline; }
.rl-home { display: flex; flex-direction: column; }
.rl-home-hero { background: var(--rl-maroon); padding: 2.5rem 1.5rem 2rem; position: relative; overflow: hidden; }
.rl-home-hero::before { content: ""; position: absolute; inset: 0; background: radial-gradient(120% 80% at 70% 0%, #7a1a1e 0%, #4a0e10 60%, #2e0608 100%); pointer-events: none; }
.rl-home-hero > * { position: relative; z-index: 1; }
.rl-home-title { font-family: "Archivo Variable", ui-sans-serif, system-ui; font-size: clamp(1.5rem, 4vw, 2.5rem); font-weight: 800; color: #fff; margin: 0 0 .5rem; letter-spacing: -.02em; line-height: 1.1; }
.rl-home-sub { color: rgba(255,255,255,.65); font-size: .9rem; margin: 0 0 1.5rem; }
.rl-home-progress { color: rgba(255,255,255,.5); font-size: .78rem; margin: .875rem 0 0; }
.rl-home-search-wrap { position: relative; max-width: 480px; display: flex; align-items: center; background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.2); border-radius: 999px; }
.rl-home-search-icon { color: rgba(255,255,255,.5); flex-shrink: 0; margin-left: 14px; }
.rl-home-search-input { flex: 1; height: 44px; padding: 0 12px; background: transparent; border: none; color: #fff; font-size: .875rem; outline: none; min-width: 0; }
.rl-home-search-input::placeholder { color: rgba(255,255,255,.4); }
.rl-home-search-clear { background: transparent; border: none; color: rgba(255,255,255,.6); cursor: pointer; padding: 0 14px; font-size: .875rem; }
.rl-home-section { padding: 1.5rem 1.5rem 0; }
.rl-home-section-hd { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
.rl-home-section-title { font-family: "Archivo Variable", ui-sans-serif, system-ui; font-size: 1rem; font-weight: 700; color: var(--rl-ink); margin: 0; display: flex; align-items: center; gap: .4rem; }
.rl-see-all { display: inline-flex; align-items: center; gap: 4px; font-size: .78rem; font-weight: 600; color: var(--rl-orange); text-decoration: none; }
.rl-stats-strip { display: grid; grid-template-columns: repeat(2, 1fr); gap: .75rem; padding: 1.25rem 1.5rem; }
@media (min-width: 600px) { .rl-stats-strip { grid-template-columns: repeat(4, 1fr); } }
.rl-stat-card { display: flex; flex-direction: column; align-items: center; gap: .25rem; padding: 1rem; background: var(--rl-bg-subtle); border: 1px solid var(--rl-line); border-radius: var(--rl-radius-lg); text-decoration: none; transition: border-color .15s; }
.rl-stat-card:hover { border-color: var(--rl-orange); }
.rl-stat-icon { color: var(--rl-orange); }
.rl-stat-value { font-family: "Archivo Variable", ui-sans-serif, system-ui; font-size: 1.35rem; font-weight: 800; color: var(--rl-ink); }
.rl-stat-label { font-size: .72rem; font-weight: 600; text-transform: uppercase; letter-spacing: .06em; color: var(--rl-body); }
.rl-home-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: .875rem; }
.rl-mini-card { display: flex; flex-direction: column; background: var(--rl-bg); border: 1px solid var(--rl-line); border-radius: var(--rl-radius-lg); overflow: hidden; text-decoration: none; transition: border-color .2s, transform .15s; }
.rl-mini-card:hover { border-color: var(--rl-orange); transform: translateY(-2px); }
.rl-mini-card--done { border-color: var(--rl-teal) !important; }
.rl-mini-thumb { width: 100%; aspect-ratio: 16/9; background: var(--rl-bg-sunken) center/cover no-repeat; }
.rl-mini-body { padding: .75rem .875rem; display: flex; flex-direction: column; gap: .2rem; }
.rl-mini-source { font-size: .65rem; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: var(--rl-orange); }
.rl-mini-title { font-family: "Archivo Variable", ui-sans-serif, system-ui; font-size: .875rem; font-weight: 700; color: var(--rl-ink); margin: 0; line-height: 1.3; }
.rl-mini-desc { font-size: .78rem; color: var(--rl-body); margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.rl-mini-meta { display: flex; align-items: center; gap: 4px; font-size: .72rem; color: var(--rl-body); }
.rl-mini-card--tool .rl-mini-thumb { display: none; }
.rl-tool-logo-wrap { display: flex; align-items: center; justify-content: center; width: 48px; height: 48px; background: var(--rl-bg-sunken); border-radius: var(--rl-radius-sm); margin: .875rem .875rem 0; overflow: hidden; }
.rl-tool-logo-wrap img { width: 100%; height: 100%; object-fit: contain; }
.rl-tool-logo-fallback { font-family: "Archivo Variable", ui-sans-serif, system-ui; font-size: 1.5rem; font-weight: 800; color: var(--rl-orange); }
.rl-search-results { display: flex; flex-direction: column; gap: .5rem; }
.rl-search-result-item { display: flex; align-items: flex-start; gap: .875rem; padding: .875rem 1rem; background: var(--rl-bg-subtle); border: 1px solid var(--rl-line); border-radius: var(--rl-radius); text-decoration: none; transition: border-color .15s; }
.rl-search-result-item:hover { border-color: var(--rl-orange); }
.rl-search-kind { flex-shrink: 0; font-size: .65rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; padding: 3px 8px; border-radius: 999px; }
.rl-search-kind--course { background: var(--rl-orange-soft); color: var(--rl-orange-deep); }
.rl-search-kind--tool { background: var(--rl-teal-soft); color: var(--rl-teal); }
.rl-search-kind--resource { background: var(--rl-bg-sunken); color: var(--rl-body); border: 1px solid var(--rl-line); }
.rl-search-result-title { font-size: .9rem; font-weight: 700; color: var(--rl-ink); margin: 0 0 .2rem; }
.rl-search-result-sub { font-size: .8rem; color: var(--rl-body); margin: 0; }
.rl-search-empty { color: var(--rl-body); font-size: .875rem; padding: 1rem 0; }
.rl-community-preview { display: flex; flex-direction: column; gap: .5rem; }
.rl-community-preview-item { display: flex; align-items: flex-start; gap: .75rem; padding: .75rem .875rem; background: var(--rl-bg-subtle); border: 1px solid var(--rl-line); border-radius: var(--rl-radius); text-decoration: none; transition: border-color .15s; }
.rl-community-preview-item:hover { border-color: var(--rl-orange); }
.rl-community-preview-avatar { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: .875rem; flex-shrink: 0; }
.rl-community-preview-author { font-size: .84rem; font-weight: 700; color: var(--rl-ink); margin: 0 0 .2rem; }
.rl-community-preview-school { font-weight: 400; color: var(--rl-body); }
.rl-community-preview-content { font-size: .82rem; color: var(--rl-body); margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.rl-community-preview-time { font-size: .7rem; color: var(--rl-body); white-space: nowrap; margin-left: auto; flex-shrink: 0; }
.rl-tools-grid { display: grid; grid-template-columns: 1fr; gap: .875rem; }
@media (min-width: 600px) { .rl-tools-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1000px) { .rl-tools-grid { grid-template-columns: repeat(3, 1fr); } }
.rl-tool-card { display: flex; flex-direction: column; background: var(--rl-bg); border: 1px solid var(--rl-line); border-radius: var(--rl-radius-lg); overflow: hidden; text-decoration: none; transition: border-color .2s, transform .15s; }
.rl-tool-card:hover { border-color: var(--rl-orange); transform: translateY(-2px); }
.rl-tool-card-logo { display: flex; align-items: center; justify-content: center; height: 80px; background: var(--rl-bg-subtle); border-bottom: 1px solid var(--rl-line); }
.rl-tool-card-logo img { max-height: 48px; max-width: 80%; object-fit: contain; }
.rl-tool-card-body { padding: .875rem 1rem; flex: 1; display: flex; flex-direction: column; gap: .25rem; }
.rl-tool-card-partner { font-size: .65rem; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: var(--rl-orange); margin: 0; }
.rl-tool-card-name { font-family: "Archivo Variable", ui-sans-serif, system-ui; font-size: .95rem; font-weight: 700; color: var(--rl-ink); margin: 0; }
.rl-tool-card-desc { font-size: .82rem; color: var(--rl-body); line-height: 1.5; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.rl-tool-card-cta { display: block; padding: .625rem 1rem; font-size: .78rem; font-weight: 700; color: var(--rl-orange); border-top: 1px solid var(--rl-line); background: var(--rl-bg-subtle); }
.rl-tool-no-embed { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 3rem 2rem; gap: 1rem; background: var(--rl-bg-subtle); border: 1px solid var(--rl-line); border-radius: var(--rl-radius-lg); }
.rl-tool-no-embed h2 { font-family: "Archivo Variable", ui-sans-serif, system-ui; font-size: 1.25rem; font-weight: 700; color: var(--rl-ink); margin: 0; }
.rl-tool-no-embed p { font-size: .875rem; color: var(--rl-body); max-width: 380px; margin: 0; }
.rl-tool-no-embed-logo { width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; background: var(--rl-bg); border: 1px solid var(--rl-line); border-radius: var(--rl-radius-lg); overflow: hidden; }
.rl-tool-no-embed-logo img { max-width: 64px; max-height: 64px; object-fit: contain; }
.rl-tool-no-embed-logo span { font-size: 2rem; font-weight: 800; color: var(--rl-orange); }
.rl-filter-row { display: flex; flex-direction: column; gap: .5rem; margin-bottom: 1.5rem; }
.rl-filter-group { display: flex; flex-wrap: wrap; gap: .375rem; }
.rl-filter-btn { padding: 5px 12px; border: 1px solid var(--rl-line-strong); border-radius: 999px; background: transparent; color: var(--rl-body); font-size: .78rem; font-weight: 600; cursor: pointer; transition: all .15s; }
.rl-filter-btn:hover { border-color: var(--rl-orange); color: var(--rl-orange); }
.rl-filter-btn--active { background: var(--rl-orange); color: #fff; border-color: var(--rl-orange); }
.rl-resources-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
@media (min-width: 600px) { .rl-resources-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1000px) { .rl-resources-grid { grid-template-columns: repeat(3, 1fr); } }
.rl-resource-card { display: flex; flex-direction: column; background: var(--rl-bg); border: 1px solid var(--rl-line); border-radius: var(--rl-radius-lg); overflow: hidden; text-decoration: none; transition: border-color .2s, transform .15s; }
.rl-resource-card:hover { border-color: var(--rl-orange); transform: translateY(-2px); }
.rl-resource-thumb { width: 100%; aspect-ratio: 16/9; background: var(--rl-bg-sunken) center/cover no-repeat; }
.rl-resource-thumb--empty { display: flex; align-items: center; justify-content: center; color: var(--rl-line-strong); }
.rl-resource-card-body { padding: .875rem 1rem; display: flex; flex-direction: column; gap: .3rem; flex: 1; }
.rl-resource-card-meta { display: flex; align-items: center; gap: .5rem; margin-bottom: .25rem; flex-wrap: wrap; }
.rl-resource-type-pill { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 999px; font-size: .65rem; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; }
.rl-resource-type--article  { background: #e0f0ff; color: #0066cc; }
.rl-resource-type--template { background: #f0e8ff; color: #6600cc; }
.rl-resource-type--app      { background: var(--rl-teal-soft); color: var(--rl-teal); }
.rl-resource-type--website  { background: var(--rl-bg-sunken); color: var(--rl-body); border: 1px solid var(--rl-line); }
.rl-resource-type--video    { background: var(--rl-orange-soft); color: var(--rl-orange-deep); }
.rl-audience-pill { display: inline-block; padding: 2px 7px; border-radius: 999px; font-size: .62rem; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; }
.rl-audience--teacher { background: var(--rl-orange-soft); color: var(--rl-orange-deep); }
.rl-audience--student { background: var(--rl-teal-soft); color: var(--rl-teal); }
.rl-audience--both    { background: var(--rl-bg-sunken); color: var(--rl-body); border: 1px solid var(--rl-line); }
[data-rl="dark"] .rl-audience--teacher { color: var(--rl-orange); }
[data-rl="dark"] .rl-audience--student { color: var(--rl-teal); }
.rl-resource-card-title { font-family: "Archivo Variable", ui-sans-serif, system-ui; font-size: .9rem; font-weight: 700; color: var(--rl-ink); margin: 0; line-height: 1.3; }
.rl-resource-card-desc { font-size: .78rem; color: var(--rl-body); margin: 0; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.rl-resource-source { font-size: .68rem; font-weight: 600; color: var(--rl-body); margin-top: auto; padding-top: .375rem; }
.rl-community-layout { display: flex; flex-direction: column; gap: 1.5rem; padding: 1.5rem 1.5rem 4rem; }
@media (min-width: 860px) { .rl-community-layout { flex-direction: row; align-items: flex-start; } }
.rl-community-feed { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1rem; }
.rl-community-sidebar { display: flex; flex-direction: column; gap: 1rem; }
@media (min-width: 860px) { .rl-community-sidebar { width: 280px; flex-shrink: 0; position: sticky; top: 72px; } }
.rl-community-sidebar-card { background: var(--rl-bg); border: 1px solid var(--rl-line); border-radius: var(--rl-radius-lg); padding: 1.25rem; }
.rl-community-cta { display: flex; align-items: center; gap: 1rem; padding: 1.25rem; background: var(--rl-orange-soft); border: 1px solid rgba(255,107,26,.2); border-radius: var(--rl-radius-lg); flex-wrap: wrap; }
.rl-community-cta-title { font-weight: 700; font-size: .9rem; color: var(--rl-ink); margin: 0 0 .2rem; }
.rl-community-cta-sub { font-size: .8rem; color: var(--rl-body); margin: 0; }
.rl-compose { display: flex; gap: .875rem; padding: 1.25rem; background: var(--rl-bg); border: 1px solid var(--rl-line); border-radius: var(--rl-radius-lg); }
.rl-compose-right { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: .625rem; }
.rl-compose-input { width: 100%; padding: .625rem .875rem; background: var(--rl-bg-subtle); border: 1px solid var(--rl-line-strong); border-radius: var(--rl-radius-sm); color: var(--rl-ink); font-size: .875rem; outline: none; resize: none; font-family: inherit; box-sizing: border-box; }
.rl-compose-input:focus { border-color: var(--rl-orange); }
.rl-compose-actions { display: flex; align-items: center; justify-content: space-between; }
.rl-compose-hint { font-size: .72rem; color: var(--rl-body); }
.rl-compose-btn { display: inline-flex; align-items: center; gap: 5px; padding: 6px 14px; background: var(--rl-orange); color: #fff; border: none; border-radius: 999px; font-size: .82rem; font-weight: 700; cursor: pointer; transition: background .15s; }
.rl-compose-btn:hover:not(:disabled) { background: var(--rl-orange-deep); }
.rl-compose-btn:disabled { opacity: .5; cursor: not-allowed; }
.rl-post { display: flex; gap: .875rem; padding: 1.25rem; background: var(--rl-bg); border: 1px solid var(--rl-line); border-radius: var(--rl-radius-lg); }
.rl-post-body { flex: 1; min-width: 0; }
.rl-post-header { display: flex; align-items: flex-start; justify-content: space-between; gap: .5rem; margin-bottom: .5rem; }
.rl-post-author { font-size: .875rem; font-weight: 700; color: var(--rl-ink); }
.rl-post-school { font-size: .82rem; font-weight: 400; color: var(--rl-body); }
.rl-post-time { font-size: .72rem; color: var(--rl-body); white-space: nowrap; flex-shrink: 0; }
.rl-post-content { font-size: .9rem; line-height: 1.6; color: var(--rl-ink); margin: 0 0 .75rem; }
.rl-post-actions { display: flex; gap: .75rem; }
.rl-post-action { display: inline-flex; align-items: center; gap: 5px; font-size: .8rem; font-weight: 600; color: var(--rl-body); background: transparent; border: none; cursor: pointer; text-decoration: none; padding: 4px 0; transition: color .15s; }
.rl-post-action:hover { color: var(--rl-orange); }
.rl-post-action--liked { color: #e11d48 !important; }
.rl-udemy-layout { display: flex; flex-direction: column; max-width: 1100px; margin: 0 auto; padding: 1.5rem 1.5rem 4rem; gap: 2rem; }
@media (min-width: 900px) { .rl-udemy-layout { flex-direction: row; align-items: flex-start; } }
.rl-udemy-main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 0; }
.rl-udemy-breadcrumb { margin-bottom: 1rem; }
.rl-udemy-player-wrap { width: 100%; border-radius: var(--rl-radius-lg); overflow: hidden; box-shadow: var(--rl-shadow-lg); background: #000; }
.rl-udemy-player-wrap iframe { display: block; width: 100%; aspect-ratio: 16/9; border: none; }
.rl-udemy-info { background: var(--rl-bg-subtle); border: 1px solid var(--rl-line); border-top: none; border-radius: 0 0 var(--rl-radius-lg) var(--rl-radius-lg); padding: 1.25rem 1.5rem 1.5rem; }
.rl-udemy-info-top { display: flex; align-items: center; gap: .75rem; margin-bottom: .375rem; flex-wrap: wrap; }
.rl-udemy-duration { display: flex; align-items: center; gap: 4px; font-size: .78rem; color: var(--rl-body); }
.rl-udemy-title { font-family: "Archivo Variable", ui-sans-serif, system-ui; font-size: clamp(1.1rem, 2.5vw, 1.5rem); font-weight: 800; color: var(--rl-ink); margin: 0 0 .375rem; letter-spacing: -.02em; }
.rl-udemy-desc { font-size: .875rem; line-height: 1.65; color: var(--rl-body); margin: 0; }
.rl-udemy-actions { margin-top: .875rem; }
.rl-udemy-sidebar { display: none; flex-direction: column; gap: 1rem; }
@media (min-width: 900px) { .rl-udemy-sidebar { display: flex; width: 300px; flex-shrink: 0; position: sticky; top: 72px; max-height: calc(100vh - 92px); overflow-y: auto; } }
.rl-udemy-sidebar-card { background: var(--rl-bg); border: 1px solid var(--rl-line); border-radius: var(--rl-radius-lg); padding: 1.25rem; display: flex; flex-direction: column; gap: .25rem; }
.rl-udemy-sidebar-label { font-size: .65rem; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: var(--rl-orange); margin: 0 0 .375rem; }
.rl-udemy-sidebar-course { font-family: "Archivo Variable", ui-sans-serif, system-ui; font-size: .9rem; font-weight: 700; color: var(--rl-ink); margin: 0; line-height: 1.3; }
.rl-udemy-lessons-mobile { margin-top: 1.25rem; background: var(--rl-bg-subtle); border: 1px solid var(--rl-line); border-radius: var(--rl-radius-lg); padding: 1rem; }
@media (min-width: 900px) { .rl-udemy-lessons-mobile { display: none; } }
.rl-lesson-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 2px; }
.rl-lesson-btn { display: flex; align-items: flex-start; gap: .5rem; width: 100%; padding: .5rem .625rem; border: 1px solid transparent; border-radius: var(--rl-radius-sm); background: transparent; text-align: left; cursor: pointer; transition: background .15s; }
.rl-lesson-btn:hover { background: var(--rl-bg-subtle); }
.rl-lesson-btn--active { background: var(--rl-orange-soft) !important; border-color: var(--rl-orange) !important; }
.rl-lesson-flat-btn { display: flex; align-items: flex-start; gap: .5rem; width: 100%; padding: .5rem .625rem; border: 1px solid transparent; border-radius: var(--rl-radius-sm); background: transparent; text-align: left; cursor: pointer; transition: background .15s; }
.rl-lesson-flat-btn:hover { background: var(--rl-bg-sunken); }
.rl-lesson-flat-btn--active { background: var(--rl-orange-soft) !important; border-color: var(--rl-orange) !important; }
.rl-lesson-num { font-size: .68rem; font-weight: 800; color: var(--rl-orange); min-width: 16px; padding-top: 1px; flex-shrink: 0; }
.rl-lesson-label { font-size: .82rem; font-weight: 500; color: var(--rl-ink); line-height: 1.35; }
.rl-related-list { display: flex; flex-direction: column; gap: .375rem; }
.rl-related-item { display: flex; align-items: center; gap: .75rem; padding: .5rem .75rem; background: var(--rl-bg-subtle); border: 1px solid var(--rl-line); border-radius: var(--rl-radius-sm); text-decoration: none; transition: border-color .15s; }
.rl-related-item:hover { border-color: var(--rl-orange); }
.rl-related-source { font-size: .62rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--rl-orange); flex-shrink: 0; }
.rl-related-name { font-size: .82rem; font-weight: 600; color: var(--rl-ink); flex: 1; line-height: 1.3; }
.rl-related-dur { font-size: .7rem; color: var(--rl-body); flex-shrink: 0; }
.rl-related-all { display: block; font-size: .8rem; font-weight: 600; color: var(--rl-orange); text-decoration: none; margin-top: .75rem; }
.rl-sidebar-divider { height: 1px; background: var(--rl-line); margin: .75rem 0; }
.rl-complete-btn { display: flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 999px; font-size: .78rem; font-weight: 700; cursor: pointer; border: 2px solid var(--rl-line-strong); background: transparent; color: var(--rl-body); transition: all .2s; white-space: nowrap; }
.rl-complete-btn:hover { border-color: var(--rl-teal); color: var(--rl-teal); background: var(--rl-teal-soft); }
.rl-complete-btn--done { border-color: var(--rl-teal) !important; color: var(--rl-teal) !important; background: var(--rl-teal-soft) !important; }
.rl-frame-wrap { width: 100%; }
.rl-frame-iframe { display: block; width: 100%; aspect-ratio: 16/9; border: none; }
.rl-frame-loading { display: flex; align-items: center; gap: .75rem; justify-content: center; padding: 4rem; background: #111; font-size: .875rem; color: rgba(255,255,255,.5); aspect-ratio: 16/9; }
.rl-frame-spinner { width: 20px; height: 20px; border: 2px solid rgba(255,255,255,.15); border-top-color: var(--rl-orange); border-radius: 50%; animation: rl-spin 1s linear infinite; }
.rl-frame-attr { display: flex; justify-content: space-between; align-items: center; padding: .5rem .875rem; background: #0d0d0d; border-top: 1px solid rgba(255,255,255,.07); font-size: .72rem; color: rgba(255,255,255,.35); gap: .5rem; flex-wrap: wrap; }
.rl-frame-attr-link { display: flex; align-items: center; gap: 4px; color: var(--rl-orange); text-decoration: none; font-weight: 600; }
.rl-frame-fallback { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 4rem 2rem; gap: .75rem; background: #111; aspect-ratio: 16/9; }
.rl-frame-fallback h3 { font-size: 1rem; font-weight: 700; color: #fff; margin: 0; }
.rl-frame-fallback p { font-size: .84rem; color: rgba(255,255,255,.5); max-width: 340px; margin: 0; }
.rl-frame-fallback-icon { opacity: .5; color: rgba(255,255,255,.3); }
.rl-frame-open-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 18px; background: var(--rl-orange); color: #fff; border-radius: 999px; font-size: .84rem; font-weight: 700; text-decoration: none; margin-top: .25rem; }
.rl-admin-page { padding: 1.5rem 1.5rem 4rem; }
.rl-admin-gate { max-width: 400px; margin: 3rem auto; padding: 2rem; background: var(--rl-bg); border: 1px solid var(--rl-line); border-radius: var(--rl-radius-lg); box-shadow: var(--rl-shadow-lg); }
.rl-admin-gate-title { font-family: "Archivo Variable", ui-sans-serif, system-ui; font-size: 1.5rem; font-weight: 800; color: var(--rl-ink); margin: .375rem 0 1rem; }
.rl-admin-gate-form { display: flex; flex-direction: column; gap: .75rem; }
.rl-admin-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: 1.75rem; flex-wrap: wrap; }
.rl-admin-title { font-family: "Archivo Variable", ui-sans-serif, system-ui; font-size: 1.75rem; font-weight: 800; color: var(--rl-ink); margin: .25rem 0 0; }
.rl-admin-add-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; background: var(--rl-orange); color: #fff; border: none; border-radius: 999px; font-size: .84rem; font-weight: 700; cursor: pointer; transition: background .15s; white-space: nowrap; flex-shrink: 0; text-decoration: none; }
.rl-admin-add-btn:hover { background: var(--rl-orange-deep); }
.rl-admin-field { display: flex; flex-direction: column; gap: 5px; }
.rl-admin-label { font-size: .68rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--rl-body); }
.rl-admin-input { width: 100%; height: 40px; padding: 0 12px; background: var(--rl-bg-subtle); border: 1px solid var(--rl-line-strong); border-radius: var(--rl-radius-sm); color: var(--rl-ink); font-size: .875rem; outline: none; transition: border-color .15s; font-family: inherit; box-sizing: border-box; }
.rl-admin-input:focus { border-color: var(--rl-orange); background: var(--rl-bg); }
.rl-admin-textarea { height: 72px !important; padding: 8px 12px !important; resize: vertical; }
.rl-admin-err { font-size: .8rem; font-weight: 700; color: var(--rl-orange); margin: 0; }
.rl-admin-submit { height: 42px; background: var(--rl-maroon); color: #fff; border: none; border-radius: 999px; font-size: .875rem; font-weight: 700; cursor: pointer; }
.rl-admin-form-card { background: var(--rl-bg-subtle); border: 1px solid var(--rl-line); border-radius: var(--rl-radius-lg); padding: 1.25rem; margin-bottom: 1.5rem; }
.rl-admin-form-title { font-family: "Archivo Variable", ui-sans-serif, system-ui; font-size: 1rem; font-weight: 700; color: var(--rl-ink); margin: 0 0 1rem; }
.rl-admin-form-grid { display: grid; grid-template-columns: 1fr; gap: .875rem; }
@media (min-width: 600px) { .rl-admin-form-grid { grid-template-columns: 1fr 1fr; } }
.rl-admin-form-actions { display: flex; justify-content: flex-end; gap: .625rem; margin-top: 1rem; }
.rl-admin-save { display: flex; align-items: center; gap: 6px; padding: 8px 18px; background: var(--rl-orange); color: #fff; border: none; border-radius: 999px; font-size: .84rem; font-weight: 700; cursor: pointer; transition: background .15s; }
.rl-admin-save:disabled { opacity: .6; cursor: not-allowed; }
.rl-admin-save:not(:disabled):hover { background: var(--rl-orange-deep); }
.rl-admin-cancel { padding: 8px 18px; background: transparent; color: var(--rl-body); border: 1px solid var(--rl-line-strong); border-radius: 999px; font-size: .84rem; font-weight: 700; cursor: pointer; }
.rl-admin-icon-btn { display: flex; align-items: center; justify-content: center; width: 30px; height: 30px; border: 1px solid var(--rl-line); border-radius: 6px; background: transparent; color: var(--rl-body); cursor: pointer; transition: all .15s; text-decoration: none; flex-shrink: 0; }
.rl-admin-icon-btn:hover { border-color: var(--rl-ink); color: var(--rl-ink); }
.rl-admin-icon-btn--danger:hover { border-color: #ef4444; color: #ef4444; background: #fef2f2; }
.rl-admin-cat-section { margin-bottom: 2.5rem; }
.rl-admin-cat-hd { display: flex; align-items: flex-start; gap: .875rem; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 2px solid var(--rl-line); }
.rl-admin-cat-hd-icon { font-size: 1.5rem; flex-shrink: 0; }
.rl-admin-cat-hd-text { flex: 1; min-width: 0; }
.rl-admin-cat-hd-title { font-family: "Archivo Variable", ui-sans-serif, system-ui; font-size: 1.1rem; font-weight: 700; color: var(--rl-ink); margin: 0 0 .2rem; }
.rl-admin-cat-hd-desc { font-size: .82rem; color: var(--rl-body); margin: 0; }
.rl-admin-cat-hd-actions { display: flex; gap: 5px; flex-shrink: 0; }
.rl-admin-course-grid { display: grid; grid-template-columns: 1fr; gap: .875rem; }
@media (min-width: 600px) { .rl-admin-course-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1000px) { .rl-admin-course-grid { grid-template-columns: repeat(3, 1fr); } }
.rl-admin-course-card { background: var(--rl-bg); border: 1px solid var(--rl-line); border-radius: var(--rl-radius-lg); overflow: hidden; display: flex; flex-direction: column; transition: border-color .15s; }
.rl-admin-course-card:hover { border-color: var(--rl-orange); }
.rl-admin-course-thumb { width: 100%; aspect-ratio: 16/9; overflow: hidden; background: var(--rl-bg-sunken); }
.rl-admin-course-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.rl-admin-course-thumb--empty { display: flex; align-items: center; justify-content: center; }
.rl-admin-course-card-body { padding: .75rem .875rem; flex: 1; display: flex; flex-direction: column; gap: .25rem; }
.rl-admin-course-card-top { display: flex; align-items: center; justify-content: space-between; gap: .5rem; }
.rl-admin-course-source { font-size: .62rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--rl-orange); }
.rl-admin-course-type { font-size: .62rem; font-weight: 600; color: var(--rl-body); background: var(--rl-bg-sunken); padding: 2px 6px; border-radius: 999px; }
.rl-admin-course-card-title { font-family: "Archivo Variable", ui-sans-serif, system-ui; font-size: .875rem; font-weight: 700; color: var(--rl-ink); margin: 0; line-height: 1.3; }
.rl-admin-course-card-desc { font-size: .78rem; color: var(--rl-body); margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.rl-admin-course-card-actions { display: flex; align-items: center; gap: 4px; padding: .5rem .875rem; border-top: 1px solid var(--rl-line); background: var(--rl-bg-subtle); flex-wrap: wrap; }
.rl-admin-course-action-btn { display: inline-flex; align-items: center; gap: 3px; padding: 3px 8px; border: 1px solid var(--rl-line); border-radius: 6px; background: var(--rl-bg); color: var(--rl-body); font-size: .7rem; font-weight: 600; cursor: pointer; transition: all .15s; text-decoration: none; }
.rl-admin-course-action-btn:hover { border-color: var(--rl-ink-soft); color: var(--rl-ink); }
.rl-admin-course-action-btn--danger:hover { border-color: #ef4444; color: #ef4444; background: #fef2f2; }
.rl-admin-add-course-card { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: .5rem; min-height: 140px; border: 2px dashed var(--rl-line-strong); border-radius: var(--rl-radius-lg); color: var(--rl-body); text-decoration: none; font-size: .84rem; font-weight: 600; transition: border-color .15s, color .15s; cursor: pointer; }
.rl-admin-add-course-card:hover { border-color: var(--rl-orange); color: var(--rl-orange); }
.rl-admin-add-course-btn, .rl-admin-add-lesson-btn { display: flex; align-items: center; gap: 4px; padding: 5px 10px; background: transparent; border: 1px dashed var(--rl-line-strong); border-radius: var(--rl-radius-sm); color: var(--rl-body); font-size: .78rem; font-weight: 600; cursor: pointer; transition: border-color .15s, color .15s; align-self: flex-start; }
.rl-admin-add-course-btn:hover, .rl-admin-add-lesson-btn:hover { border-color: var(--rl-orange); color: var(--rl-orange); }
.rl-admin-lesson-row { display: flex; align-items: center; gap: .5rem; padding: 3px 0; }
.rl-admin-lesson-num { font-size: .68rem; font-weight: 800; color: var(--rl-orange); width: 16px; flex-shrink: 0; }
.rl-admin-lesson-title { font-size: .8rem; color: var(--rl-ink); flex: 1; }
.rl-add-page { padding: 1.5rem 1.5rem 4rem; }
.rl-add-back { display: inline-flex; align-items: center; gap: 6px; font-size: .8rem; font-weight: 600; color: var(--rl-body); text-decoration: none; margin-bottom: 1.5rem; transition: color .15s; }
.rl-add-back:hover { color: var(--rl-orange); }
.rl-add-layout { display: flex; flex-direction: column; gap: 2rem; }
@media (min-width: 860px) { .rl-add-layout { flex-direction: row; align-items: flex-start; } }
.rl-add-form-col { flex: 1; min-width: 0; }
.rl-add-thumb-col { width: 100%; }
@media (min-width: 860px) { .rl-add-thumb-col { width: 280px; flex-shrink: 0; position: sticky; top: 72px; } }
.rl-add-title { font-family: "Archivo Variable", ui-sans-serif, system-ui; font-size: clamp(1.4rem, 3.5vw, 1.875rem); font-weight: 800; color: var(--rl-ink); margin: 0 0 .375rem; letter-spacing: -.02em; }
.rl-add-subtitle { font-size: .875rem; color: var(--rl-body); margin: 0 0 1.75rem; line-height: 1.6; }
.rl-add-section { margin-bottom: 1.125rem; display: flex; flex-direction: column; gap: 5px; }
.rl-add-row { display: flex; gap: 1rem; }
@media (max-width: 600px) { .rl-add-row { flex-direction: column; } }
.rl-add-input { width: 100%; height: 42px; padding: 0 12px; background: var(--rl-bg-subtle); border: 1px solid var(--rl-line-strong); border-radius: var(--rl-radius-sm); color: var(--rl-ink); font-size: .875rem; outline: none; transition: border-color .15s; font-family: inherit; box-sizing: border-box; }
.rl-add-input:focus { border-color: var(--rl-orange); background: var(--rl-bg); }
.rl-add-textarea { height: 88px !important; padding: 10px 12px !important; resize: vertical; }
.rl-add-hint { font-size: .72rem; color: var(--rl-body); margin: 2px 0 0; }
.rl-add-hint strong { color: var(--rl-ink); }
.rl-add-error { padding: .75rem 1rem; background: var(--rl-maroon-soft); color: var(--rl-maroon); border-radius: var(--rl-radius-sm); font-size: .84rem; font-weight: 600; margin-bottom: 1.25rem; }
.rl-add-save { display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%; height: 46px; background: var(--rl-orange); color: #fff; border: none; border-radius: 999px; font-size: .9rem; font-weight: 700; cursor: pointer; transition: background .15s; margin-top: .625rem; }
.rl-add-save:hover:not(:disabled) { background: var(--rl-orange-deep); }
.rl-add-save:disabled { opacity: .6; cursor: not-allowed; }
.rl-type-row { display: flex; gap: .5rem; flex-wrap: wrap; }
.rl-type-btn { display: flex; align-items: center; gap: 5px; padding: 7px 14px; border: 1.5px solid var(--rl-line-strong); border-radius: var(--rl-radius-sm); background: transparent; color: var(--rl-body); font-size: .82rem; font-weight: 600; cursor: pointer; transition: all .15s; }
.rl-type-btn--active { border-color: var(--rl-orange); background: var(--rl-orange-soft); color: var(--rl-orange-deep); }
.rl-lessons-list { display: flex; flex-direction: column; gap: .75rem; }
.rl-lesson-input-row { display: flex; align-items: flex-start; gap: .75rem; }
.rl-lesson-input-num { font-size: .72rem; font-weight: 800; color: var(--rl-orange); padding-top: 13px; min-width: 18px; flex-shrink: 0; }
.rl-lesson-input-fields { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
.rl-thumb-drop { width: 100%; aspect-ratio: 16/9; border: 2px dashed var(--rl-line-strong); border-radius: var(--rl-radius); cursor: pointer; overflow: hidden; transition: border-color .15s; display: flex; align-items: center; justify-content: center; background: var(--rl-bg-subtle); }
.rl-thumb-drop:hover, .rl-thumb-drop--over { border-color: var(--rl-orange); background: var(--rl-orange-soft); }
.rl-thumb-preview { width: 100%; height: 100%; object-fit: cover; display: block; }
.rl-thumb-empty { display: flex; flex-direction: column; align-items: center; gap: .5rem; color: var(--rl-body); text-align: center; padding: 1rem; }
.rl-thumb-empty p { font-size: .84rem; font-weight: 600; margin: 0; }
.rl-thumb-empty span { font-size: .72rem; opacity: .7; }
.rl-thumb-empty-icon { opacity: .4; }
.rl-thumb-clear { margin-top: .5rem; font-size: .78rem; color: var(--rl-body); background: transparent; border: none; cursor: pointer; text-decoration: underline; }
.rl-hero-kicker { font-size: .68rem; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; color: var(--rl-orange); margin: 0 0 .5rem; }
.rl-toast { position: fixed; bottom: 76px; left: 50%; transform: translateX(-50%); background: var(--rl-ink); color: #fff; padding: 9px 18px; border-radius: 999px; font-size: .84rem; font-weight: 600; z-index: 200; box-shadow: var(--rl-shadow-lg); white-space: nowrap; animation: rl-fadein .2s ease; }
@media (min-width: 860px) { .rl-toast { bottom: 24px; } }
@keyframes rl-fadein { from { opacity: 0; transform: translateX(-50%) translateY(8px); } }
@media (prefers-reduced-motion: reduce) { .rl-mini-card, .rl-tool-card, .rl-resource-card { transition: none !important; } .rl-spin { animation: none !important; } }
`;
"use client";

import { ExternalLink, WifiOff, AlertTriangle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { normaliseEmbedUrl } from "@/lib/revlearn/utils";

type FrameState = "loading" | "ready" | "blocked" | "offline";

export function ResourceFrame({
  url,
  title,
  sourceName,
}: {
  url: string;
  title: string;
  sourceName: string;
}) {
  const [state, setState] = useState<FrameState>("loading");
  const [online, setOnline] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const embedUrl = normaliseEmbedUrl(url);

  useEffect(() => {
    setOnline(navigator.onLine);
    const up = () => { setOnline(true); setState("loading"); };
    const down = () => { setOnline(false); setState("offline"); };
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    return () => {
      window.removeEventListener("online", up);
      window.removeEventListener("offline", down);
    };
  }, []);

  useEffect(() => {
    if (!online) return;
    setState("loading");
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setState("blocked"), 8000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [url, online]);

  if (!online) {
    return (
      <div className="rl-frame-fallback">
        <WifiOff size={32} className="rl-frame-fallback-icon" />
        <h3>You're offline</h3>
        <p>Connect to the internet to access this resource.</p>
      </div>
    );
  }

  if (state === "blocked") {
    return (
      <div className="rl-frame-fallback">
        <AlertTriangle size={32} className="rl-frame-fallback-icon" />
        <h3>Can't preview this resource</h3>
        <p>{sourceName} doesn't allow embedding — open it directly to view.</p>
        <a href={url} target="_blank" rel="noopener noreferrer" className="rl-frame-open-btn">
          <ExternalLink size={14} /> Open on {sourceName}
        </a>
      </div>
    );
  }

  return (
    <div className="rl-frame-wrap">
      {state === "loading" && (
        <div className="rl-frame-loading">
          <div className="rl-frame-spinner" />
          <span>Loading from {sourceName}…</span>
        </div>
      )}
      <iframe
        src={embedUrl}
        title={title}
        className="rl-frame-iframe"
        style={{ opacity: state === "ready" ? 1 : 0, position: state === "loading" ? "absolute" : "relative", top: 0, left: 0 }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        onLoad={() => {
          if (timerRef.current) clearTimeout(timerRef.current);
          setState("ready");
        }}
        onError={() => setState("blocked")}
      />
      <div className="rl-frame-attr">
        <span>Content via <strong>{sourceName}</strong></span>
        <a href={url} target="_blank" rel="noopener noreferrer" className="rl-frame-attr-link">
          <ExternalLink size={11} /> View original
        </a>
      </div>
    </div>
  );
}
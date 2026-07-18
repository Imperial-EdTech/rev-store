"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Heart, MessageCircle, Send, Users } from "lucide-react";
import { RevLearnShell } from "@/components/revlearn/shell";
import { usePosts, useProfile, useLikedPosts } from "@/lib/revlearn-hooks";
import { getAvatarColor, getInitials, timeAgo } from "@/lib/revlearn-utils";
import type { Post } from "@/lib/revlearn-types";

function Avatar({ name, color, size = 36 }: { name: string; color: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, background: color, fontSize: size * 0.36,
      borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontWeight: 700, flexShrink: 0, letterSpacing: "-.02em",
    }}>
      {getInitials(name)}
    </div>
  );
}

export default function CommunityPage() {
  const { posts, loading, error, reload } = usePosts();
  const { profile } = useProfile();
  const { liked, toggle: toggleLike } = useLikedPosts();
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState("");

  async function submitPost() {
    if (!content.trim() || !profile) return;
    setPosting(true);
    setPostError("");
    try {
      const res = await fetch("/api/revlearn/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          author_name: profile.name,
          author_school: profile.school,
          author_subject: profile.subject,
          author_avatar: getAvatarColor(profile.name),
        }),
      });
      if (!res.ok) throw new Error("Failed to post.");
      setContent("");
      reload();
    } catch (e) {
      setPostError((e as Error).message);
    } finally {
      setPosting(false);
    }
  }

  async function handleLike(post: Post) {
    const wasLiked = liked.has(post.id);
    toggleLike(post.id);
    await fetch("/api/revlearn/posts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: post.id, increment: !wasLiked }),
    });
    reload();
  }

  return (
    <RevLearnShell>
      <div className="rl-page">
        <div className="rl-page-hero">
          <p className="rl-page-kicker">Community</p>
          <h1 className="rl-page-title">Connect with teachers across Nigeria</h1>
          <p className="rl-page-sub">Share ideas, ask questions, and learn from each other.</p>
        </div>

        <div className="rl-community-layout">
          {/* ── Feed ─────────────────────────────────── */}
          <div className="rl-community-feed">

            {/* Compose box */}
            {profile ? (
              <div className="rl-compose">
                <Avatar name={profile.name} color={getAvatarColor(profile.name)} size={40} />
                <div className="rl-compose-right">
                  <textarea
                    className="rl-compose-input"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder={`What's on your mind, ${profile.name.split(" ")[0]}?`}
                    rows={3}
                    maxLength={500}
                  />
                  {postError && <p className="rl-admin-err">{postError}</p>}
                  <div className="rl-compose-actions">
                    <span className="rl-compose-hint">{content.length}/500</span>
                    <button
                      className="rl-compose-btn"
                      onClick={submitPost}
                      disabled={posting || !content.trim() || content.length > 500}
                    >
                      {posting ? <Loader2 size={14} className="rl-spin" /> : <Send size={14} />}
                      Post
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rl-community-cta">
                <Users size={24} style={{ color: "var(--rl-orange)", flexShrink: 0 }} />
                <div>
                  <p className="rl-community-cta-title">Set up your profile to post</p>
                  <p className="rl-community-cta-sub">It takes 30 seconds — just your name and school.</p>
                </div>
                <Link href="/revlearn/profile" className="rl-admin-add-btn" style={{ textDecoration: "none", flexShrink: 0 }}>
                  Set up profile
                </Link>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="rl-state-center">
                <Loader2 size={24} className="rl-spin" />
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="rl-error-box">
                <p className="rl-error-title">{error}</p>
                <button className="rl-retry-btn" onClick={reload}>Retry</button>
              </div>
            )}

            {/* Posts */}
            {!loading && !error && posts.map((post: Post) => (
              <div key={post.id} className="rl-post">
                <Avatar
                  name={post.authorName}
                  color={post.authorAvatar ?? getAvatarColor(post.authorName)}
                  size={42}
                />
                <div className="rl-post-body">
                  <div className="rl-post-header">
                    <div>
                      <span className="rl-post-author">{post.authorName}</span>
                      {post.authorSchool && (
                        <span className="rl-post-school"> · {post.authorSchool}</span>
                      )}
                      {post.authorSubject && (
                        <span className="rl-post-school"> · {post.authorSubject}</span>
                      )}
                    </div>
                    <span className="rl-post-time">{timeAgo(post.createdAt)}</span>
                  </div>

                  <p className="rl-post-content">{post.content}</p>

                  <div className="rl-post-actions">
                    <button
                      className={`rl-post-action${liked.has(post.id) ? " rl-post-action--liked" : ""}`}
                      onClick={() => handleLike(post)}
                    >
                      <Heart size={14} fill={liked.has(post.id) ? "currentColor" : "none"} />
                      {post.likes > 0 && <span>{post.likes}</span>}
                    </button>
                    <Link href={`/revlearn/community/${post.id}`} className="rl-post-action">
                      <MessageCircle size={14} />
                      <span>{post.commentCount ? `${post.commentCount} comment${post.commentCount !== 1 ? "s" : ""}` : "Reply"}</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty state */}
            {!loading && !error && posts.length === 0 && (
              <div className="rl-empty">
                <p className="rl-empty-icon">💬</p>
                <p>No posts yet. Be the first to share something with the community!</p>
              </div>
            )}
          </div>

          {/* ── Sidebar ──────────────────────────────── */}
          <aside className="rl-community-sidebar">
            <div className="rl-community-sidebar-card">
              <p className="rl-udemy-sidebar-label">Your profile</p>
              {profile ? (
                <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: ".875rem" }}>
                    <Avatar name={profile.name} color={getAvatarColor(profile.name)} size={44} />
                    <div>
                      <p style={{ fontWeight: 700, fontSize: ".9rem", color: "var(--rl-ink)", margin: "0 0 .15rem" }}>
                        {profile.name}
                      </p>
                      <p style={{ fontSize: ".78rem", color: "var(--rl-body)", margin: 0 }}>
                        {profile.school}
                      </p>
                      {profile.subject && (
                        <p style={{ fontSize: ".78rem", color: "var(--rl-body)", margin: 0 }}>
                          {profile.subject}
                        </p>
                      )}
                    </div>
                  </div>
                  <Link href="/revlearn/profile"
                    style={{ fontSize: ".78rem", color: "var(--rl-orange)", textDecoration: "none", fontWeight: 600 }}>
                    Edit profile →
                  </Link>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: ".84rem", color: "var(--rl-body)", margin: "0 0 .875rem", lineHeight: 1.55 }}>
                    Create a profile to post and connect with other teachers.
                  </p>
                  <Link href="/revlearn/profile" className="rl-admin-add-btn"
                    style={{ textDecoration: "none", display: "inline-flex" }}>
                    Set up profile
                  </Link>
                </div>
              )}
            </div>

            <div className="rl-community-sidebar-card">
              <p className="rl-udemy-sidebar-label">Community guidelines</p>
              <ul style={{
                fontSize: ".82rem", color: "var(--rl-body)", paddingLeft: "1.125rem",
                margin: 0, display: "flex", flexDirection: "column", gap: ".4rem", lineHeight: 1.5
              }}>
                <li>Be respectful and supportive of fellow teachers</li>
                <li>Share resources, tips, and classroom ideas</li>
                <li>Ask questions freely — no question is too basic</li>
                <li>No spam or promotional content</li>
              </ul>
            </div>

            <div className="rl-community-sidebar-card">
              <p className="rl-udemy-sidebar-label">Activity</p>
              <div style={{ display: "flex", flexDirection: "column", gap: ".375rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".84rem" }}>
                  <span style={{ color: "var(--rl-body)" }}>Total posts</span>
                  <span style={{ fontWeight: 700, color: "var(--rl-ink)" }}>{posts.length}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".84rem" }}>
                  <span style={{ color: "var(--rl-body)" }}>Total likes</span>
                  <span style={{ fontWeight: 700, color: "var(--rl-ink)" }}>
                    {posts.reduce((s: number, p: Post) => s + p.likes, 0)}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </RevLearnShell>
  );
}
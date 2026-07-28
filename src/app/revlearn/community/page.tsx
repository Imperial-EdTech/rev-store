"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Heart, MessageCircle, Send, AlertCircle } from "lucide-react";
import { RevLearnShell } from "@/components/revlearn/shell";
import { usePosts, useProfile, useLikedPosts } from "@/lib/revlearn-hooks";
import { getAvatarColor, getInitials, timeAgo } from "@/lib/revlearn-utils";
import type { Post } from "@/lib/revlearn-types";

const D = '"Archivo Variable", ui-sans-serif, system-ui';

function Avatar({ name, color, size = 36 }: { name: string; color: string; size?: number }) {
  return (
    <div style={{ width:size, height:size, background:color, fontSize:size*0.36, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, flexShrink:0, letterSpacing:"-.02em" }}>
      {getInitials(name)}
    </div>
  );
}

function PostCard({ post, liked, onLike }: { post: Post; liked: boolean; onLike: () => void }) {
  return (
    <div className="rl-post">
      <Avatar name={post.authorName} color={post.authorAvatar ?? getAvatarColor(post.authorName)} size={42}/>
      <div className="rl-post-body">
        <div className="rl-post-hd">
          <div>
            <span className="rl-post-author">{post.authorName}</span>
            {post.authorSchool && <span className="rl-post-school"> · {post.authorSchool}</span>}
            {post.authorSubject && <span className="rl-post-school"> · {post.authorSubject}</span>}
          </div>
          <span className="rl-post-time">{timeAgo(post.createdAt)}</span>
        </div>
        <p className="rl-post-content">{post.content}</p>
        <div className="rl-post-actions">
          <button className={`rl-post-action${liked ? " rl-post-action--liked" : ""}`} onClick={onLike}>
            <Heart size={14} fill={liked ? "currentColor" : "none"}/>
            {post.likes > 0 && <span>{post.likes}</span>}
          </button>
          <Link href={`/revlearn/community/${post.id}`} className="rl-post-action">
            <MessageCircle size={14}/>
            <span>{post.commentCount ? `${post.commentCount} comment${post.commentCount !== 1 ? "s" : ""}` : "Reply"}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CommunityPage() {
  const { posts, loading, error, reload } = usePosts();
  const { profile }                        = useProfile();
  const { liked, toggle: toggleLike }      = useLikedPosts();
  const [content, setContent]              = useState("");
  const [posting, setPosting]              = useState(false);
  const [postError, setPostError]          = useState("");

  async function submitPost() {
    if (!content.trim() || !profile) return;
    setPosting(true); setPostError("");
    try {
      const res = await fetch("/api/revlearn/posts", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ content:content.trim(), author_name:profile.name, author_school:profile.school, author_subject:profile.subject, author_avatar:getAvatarColor(profile.name) }),
      });
      if (!res.ok) throw new Error("Failed to post.");
      setContent(""); reload();
    } catch (e) { setPostError((e as Error).message); }
    finally { setPosting(false); }
  }

  async function handleLike(post: Post) {
    const wasLiked = liked.has(post.id);
    toggleLike(post.id);
    await fetch("/api/revlearn/posts", { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ id:post.id, increment:!wasLiked }) });
    reload();
  }

  return (
    <RevLearnShell>
      <div className="rl-page-hero">
        <p className="rl-page-kicker">Community</p>
        <h1 className="rl-page-title">Connect with teachers across Nigeria</h1>
        <p className="rl-page-sub">Share ideas, ask questions, and learn from each other.</p>
      </div>

      <div className="rl-community-layout">
        {/* Feed */}
        <div className="rl-community-feed">

          {/* Compose */}
          {profile ? (
            <div className="rl-compose">
              <Avatar name={profile.name} color={getAvatarColor(profile.name)} size={40}/>
              <div className="rl-compose-right">
                <textarea className="rl-compose-input" value={content} onChange={e => setContent(e.target.value)}
                  placeholder={`What's on your mind, ${profile.name.split(" ")[0]}?`} rows={3} maxLength={500}/>
                {postError && <p style={{ margin:0, fontSize:".8rem", fontWeight:700, color:"#dc2626" }}>{postError}</p>}
                <div className="rl-compose-actions">
                  <span className="rl-compose-hint">{content.length}/500</span>
                  <button className="rl-compose-btn" onClick={submitPost} disabled={posting || !content.trim() || content.length > 500}>
                    {posting ? <Loader2 size={13} className="rl-spin"/> : <Send size={13}/>}
                    {posting ? "Posting…" : "Post"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:"1rem", padding:"1.125rem 1.375rem", background:"var(--rl-maroon-light)", border:"1px solid rgba(74,14,16,.1)", borderRadius:22, flexWrap:"wrap" }}>
              <div>
                <p style={{ margin:"0 0 .2rem", fontFamily:D, fontWeight:700, fontSize:".9rem", color:"var(--rl-ink)" }}>Join the conversation</p>
                <p style={{ margin:0, fontSize:".82rem", color:"var(--rl-body)" }}>Set up your profile to post and connect with other teachers.</p>
              </div>
              <Link href="/revlearn/profile" style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"8px 16px", background:"var(--rl-maroon)", color:"#fff", borderRadius:"999px", fontSize:".84rem", fontWeight:700, textDecoration:"none", flexShrink:0 }}>
                Set up profile →
              </Link>
            </div>
          )}

          {loading && <div className="rl-state-center"><Loader2 size={24} className="rl-spin"/></div>}
          {error && (
            <div className="rl-error-box">
              <AlertCircle size={16}/>
              <div><p className="rl-error-title">{error}</p><button className="rl-retry-btn" onClick={reload}>Retry</button></div>
            </div>
          )}
          {!loading && !error && posts.length === 0 && (
            <div className="rl-empty">
              <p className="rl-empty-icon">💬</p>
              <p>No posts yet. Be the first to share something!</p>
            </div>
          )}
          {posts.map((post: Post) => (
            <PostCard key={post.id} post={post} liked={liked.has(post.id)} onLike={() => handleLike(post)}/>
          ))}
        </div>

        {/* Sidebar — guidelines only, no activity stats */}
        <aside className="rl-community-side">
          {profile && (
            <div className="rl-comm-sidebar-card">
              <p className="rl-comm-sidebar-label">Your profile</p>
              <div style={{ display:"flex", alignItems:"center", gap:".875rem", marginBottom:".75rem" }}>
                <Avatar name={profile.name} color={getAvatarColor(profile.name)} size={44}/>
                <div>
                  <p style={{ fontFamily:D, fontWeight:700, fontSize:".9rem", color:"var(--rl-ink)", margin:"0 0 .15rem" }}>{profile.name}</p>
                  <p style={{ fontSize:".78rem", color:"var(--rl-body)", margin:0 }}>{profile.school}</p>
                  {profile.subject && <p style={{ fontSize:".78rem", color:"var(--rl-body)", margin:0 }}>{profile.subject}</p>}
                </div>
              </div>
              <Link href="/revlearn/profile" style={{ fontSize:".78rem", color:"var(--rl-orange)", textDecoration:"none", fontWeight:600 }}>Edit profile →</Link>
            </div>
          )}

          {/* Guidelines only — no activity stats */}
          <div className="rl-comm-sidebar-card">
            <p className="rl-comm-sidebar-label">Community guidelines</p>
            <ul style={{ fontSize:".82rem", color:"var(--rl-body)", paddingLeft:"1.125rem", margin:0, display:"flex", flexDirection:"column", gap:".4rem", lineHeight:1.55 }}>
              <li>Be respectful and supportive of fellow teachers</li>
              <li>Share resources, tips, and classroom ideas</li>
              <li>Ask questions freely — no question is too basic</li>
              <li>No spam or promotional content</li>
            </ul>
          </div>
        </aside>
      </div>
    </RevLearnShell>
  );
}

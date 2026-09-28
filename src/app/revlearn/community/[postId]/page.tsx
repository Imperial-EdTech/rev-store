"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Heart, ArrowLeft, Send } from "lucide-react";
import { RevLearnShell } from "@/components/revlearn/shell";
import { likePost, usePost, useProfile, useLikedPosts } from "@/lib/revlearn/hooks";
import { getAvatarColor, getInitials, timeAgo } from "@/lib/revlearn/utils";
import type { Post, Comment } from "@/lib/revlearn/types";

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

export default function PostPage() {
  const { postId } = useParams<{ postId: string }>();
  const { post, setPost, comments, loading, reload } = usePost(postId);
  const { profile } = useProfile();
  const { liked, toggle: toggleLike } = useLikedPosts();
  const [reply, setReply] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replyError, setReplyError] = useState("");


  async function handleLike() {
    if (!post) return;
    const nowLiked = !liked.has(post.id);
    toggleLike(post.id);
    const likes = await likePost(post.id, nowLiked);
    if (likes === null) { toggleLike(post.id); return; } // didn't save: undo
    setPost({ ...post, likes });
  }

  async function submitReply() {
    if (!reply.trim() || !profile) return;
    setSubmitting(true);
    setReplyError("");
    try {
      const res = await fetch(`/api/revlearn/posts/${encodeURIComponent(postId)}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: reply.trim(),
          author_name: profile.name,
          author_avatar: getAvatarColor(profile.name),
        }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.error ?? "Failed to post reply.");
      setReply("");
      reload();
    } catch (e) {
      setReplyError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading && !post) {
    return (
      <RevLearnShell>
        <div className="rl-state-center" style={{ minHeight: "60vh" }}>
          <Loader2 size={24} className="rl-spin" />
        </div>
      </RevLearnShell>
    );
  }

  if (!post) {
    return (
      <RevLearnShell>
        <div className="rl-page-body">
          <div className="rl-error-box">
            <p className="rl-error-title">Post not found</p>
            <Link href="/revlearn/community" className="rl-retry-btn"
              style={{ display: "inline-block", marginTop: ".5rem" }}>
              Back to community
            </Link>
          </div>
        </div>
      </RevLearnShell>
    );
  }

  return (
    <RevLearnShell>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "1.5rem 1.5rem 4rem" }}>

        <Link href="/revlearn/community" className="rl-add-back">
          <ArrowLeft size={15} /> Back to community
        </Link>

        {/* Original post */}
        <div className="rl-post" style={{ marginBottom: "1.5rem" }}>
          <Avatar
            name={post.authorName}
            color={post.authorAvatar ?? getAvatarColor(post.authorName)}
            size={44}
          />
          <div className="rl-post-body">
            <div className="rl-post-header">
              <div>
                <span className="rl-post-author">{post.authorName}</span>
                {post.authorSchool && <span className="rl-post-school"> · {post.authorSchool}</span>}
                {post.authorSubject && <span className="rl-post-school"> · {post.authorSubject}</span>}
              </div>
              <span className="rl-post-time">{timeAgo(post.createdAt)}</span>
            </div>
            <p className="rl-post-content" style={{ fontSize: "1rem" }}>{post.content}</p>
            <div className="rl-post-actions">
              <button
                className={`rl-post-action${liked.has(post.id) ? " rl-post-action--liked" : ""}`}
                onClick={handleLike}
              >
                <Heart size={14} fill={liked.has(post.id) ? "currentColor" : "none"} />
                <span>{post.likes > 0 ? post.likes : ""} {post.likes === 1 ? "like" : post.likes > 1 ? "likes" : "Like"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Comments */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h2 style={{
            fontFamily: "Archivo Variable, ui-sans-serif, system-ui",
            fontSize: "1rem", fontWeight: 700, color: "var(--rl-ink)",
            margin: "0 0 1rem", display: "flex", alignItems: "center", gap: ".5rem"
          }}>
            {comments.length} {comments.length === 1 ? "comment" : "comments"}
          </h2>

          {loading && (
            <div className="rl-state-center" style={{ padding: "2rem" }}>
              <Loader2 size={20} className="rl-spin" />
            </div>
          )}

          {!loading && comments.length === 0 && (
            <div style={{ padding: "1.5rem", textAlign: "center", color: "var(--rl-body)", fontSize: ".875rem", background: "var(--rl-bg-subtle)", borderRadius: "var(--rl-radius)", border: "1px solid var(--rl-line)" }}>
              No comments yet. Be the first to reply.
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: ".875rem" }}>
            {comments.map((comment: Comment) => (
              <div key={comment.id} className="rl-post" style={{ padding: "1rem" }}>
                <Avatar
                  name={comment.authorName}
                  color={comment.authorAvatar ?? getAvatarColor(comment.authorName)}
                  size={34}
                />
                <div className="rl-post-body">
                  <div className="rl-post-header">
                    <span className="rl-post-author">{comment.authorName}</span>
                    <span className="rl-post-time">{timeAgo(comment.createdAt)}</span>
                  </div>
                  <p className="rl-post-content" style={{ marginBottom: 0 }}>{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reply box */}
        {profile ? (
          <div className="rl-compose">
            <Avatar name={profile.name} color={getAvatarColor(profile.name)} size={36} />
            <div className="rl-compose-right">
              <textarea
                className="rl-compose-input"
                value={reply}
                onChange={e => setReply(e.target.value)}
                placeholder="Write a reply…"
                rows={3}
                maxLength={500}
              />
              {replyError && <p className="rl-admin-err">{replyError}</p>}
              <div className="rl-compose-actions">
                <span className="rl-compose-hint">{reply.length}/500</span>
                <button
                  className="rl-compose-btn"
                  onClick={submitReply}
                  disabled={submitting || !reply.trim()}
                >
                  {submitting ? <Loader2 size={14} className="rl-spin" /> : <Send size={14} />}
                  Reply
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rl-community-cta">
            <div>
              <p className="rl-community-cta-title">Set up your profile to reply</p>
              <p className="rl-community-cta-sub">Join the conversation in 30 seconds.</p>
            </div>
            <Link href="/revlearn/profile" className="rl-admin-add-btn"
              style={{ textDecoration: "none", flexShrink: 0 }}>
              Set up profile
            </Link>
          </div>
        )}
      </div>
    </RevLearnShell>
  );
}
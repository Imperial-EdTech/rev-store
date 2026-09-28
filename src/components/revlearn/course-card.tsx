"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Clock, BookOpen } from "lucide-react";
import type { Category, Course } from "@/lib/revlearn/types";
import { getYoutubeThumbnail } from "@/lib/revlearn/utils";

export function CourseCard({
  category, course, completed = false,
}: {
  category: Category; course: Course; completed?: boolean;
}) {
  const thumb = course.thumbnail || getYoutubeThumbnail(course.url ?? "") || null;

  return (
    <Link href={`/revlearn/${category.id}/${course.id}`}
      className={`rl-course-card${completed ? " rl-course-card--done" : ""}`}>
      <div className="rl-course-thumb">
        {thumb ? (
          <Image
            src={thumb}
            alt={course.title}
            fill
            sizes="(max-width: 480px) 100vw, (max-width: 900px) 50vw, 25vw"
            className="rl-course-thumb-img"
            loading="lazy"
            unoptimized
          />
        ) : (
          <div className="rl-course-thumb-placeholder"><BookOpen size={26} /></div>
        )}
        {completed && (
          <span className="rl-course-done-badge"><CheckCircle2 size={12} /> Done</span>
        )}
        {course.type === "multi" && (
          <span className="rl-course-lessons-badge">
            {course.lessons?.length ?? 0} lessons
          </span>
        )}
      </div>
      <div className="rl-course-body">
        <div className="rl-course-source">{course.sourceName}</div>
        <h3 className="rl-course-title">{course.title}</h3>
        <p className="rl-course-desc">{course.description}</p>
        <div className="rl-course-meta">
          {course.duration && (
            <span className="rl-course-meta-item"><Clock size={11} /> {course.duration}</span>
          )}
        </div>
        {course.tags?.length > 0 && (
          <div className="rl-tags">
            {course.tags.slice(0, 3).map((tag: string) => (
              <span key={tag} className="rl-tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
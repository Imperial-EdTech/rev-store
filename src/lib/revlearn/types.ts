export type Accent = "orange" | "maroon" | "teal" | "amber";
export type CourseType = "single" | "multi";
export type ResourceType = "article" | "template" | "app" | "website" | "video";
export type Audience = "teacher" | "student" | "both";

export type Lesson = {
  id: string;
  courseId: string;
  title: string;
  url: string;
  position: number;
};

export type Course = {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  thumbnail: string;
  tags: string[];
  type: CourseType;
  url?: string;
  lessons?: Lesson[];
  sourceName: string;
  duration: string;
  position: number;
  createdAt: string;
};

export type Category = {
  id: string;
  title: string;
  description: string;
  icon: string;
  accent: Accent;
  position: number;
  courses: Course[];
};

export type Tool = {
  id: string;
  name: string;
  description: string;
  embedUrl?: string;
  externalUrl?: string;
  logoUrl?: string;
  partnerName: string;
  category: string;
  tags: string[];
  featured: boolean;
  position: number;
};

export type Resource = {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail?: string;
  type: ResourceType;
  audience: Audience;
  sourceName: string;
  tags: string[];
  featured: boolean;
  position: number;
  createdAt: string;
};

export type Post = {
  id: string;
  content: string;
  authorName: string;
  authorSchool?: string;
  authorSubject?: string;
  authorAvatar?: string;
  likes: number;
  commentCount?: number;
  createdAt: string;
};

export type Comment = {
  id: string;
  postId: string;
  content: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
};

export type LocalProfile = {
  name: string;
  school: string;
  subject: string;
  avatarColor: string;
  joinedAt: string;
};

export type SearchResult =
  | { kind: "course"; categoryId: string; categoryTitle: string; id: string; title: string; description: string; sourceName: string }
  | { kind: "tool"; id: string; title: string; description: string; partnerName: string }
  | { kind: "resource"; id: string; title: string; description: string; type: string; audience: string };                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
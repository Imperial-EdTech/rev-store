export type Role =
  | "Teacher"
  | "School Owner"
  | "School Administrator"
  | "Parent"
  | "Education Professional"
  | "Student"
  | "Other";

export type WaitlistRegistration = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  organization: string;
  role: Role;
  interests: string[];
  deviceCount?: number | null;
  notes?: string | null;
  createdAt: string;
};

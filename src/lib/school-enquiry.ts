/**
 * Options on the school enquiry form (/apply/school). Shared by the form and
 * the server, which stores the labels (not the ids) on the lead.
 */
export const SCHOOL_DEVICE_TYPES = [
  { id: "laptops", label: "Laptops", icon: "💻", desc: "Rev Orion & Aelia — Windows 11" },
  { id: "tablets", label: "Tablets", icon: "📱", desc: "Rev Tab — Android 13" },
  { id: "all-in-ones", label: "All-in-One PCs", icon: "🖥️", desc: "Desktop + display in one unit" },
  { id: "cloud-server", label: "Cloud / Server", icon: "☁️", desc: "Local school server & cloud setup" },
  { id: "interactive-boards", label: "Interactive Boards", icon: "📺", desc: "Smart boards for classrooms" },
] as const;

export const SCHOOL_PURPOSES = [
  { id: "teachers", label: "For our teachers", desc: "Equip teaching staff with devices" },
  { id: "students", label: "For our students", desc: "Student devices and learning tools" },
  { id: "lab", label: "Setting up a lab", desc: "Computer lab or tech centre" },
  { id: "admin", label: "Administrative use", desc: "Office and admin functions" },
] as const;

export const SCHOOL_ROLES = [
  "School Owner / Proprietor",
  "School Principal",
  "School Administrator",
  "Head of IT / Technology",
  "Procurement Officer",
  "Other",
] as const;

export const FINANCING_INTEREST = ["yes", "maybe", "no"] as const;

export type SchoolDeviceTypeId = (typeof SCHOOL_DEVICE_TYPES)[number]["id"];
export type SchoolPurposeId = (typeof SCHOOL_PURPOSES)[number]["id"];

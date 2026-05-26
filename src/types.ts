export interface Session {
  id: string;
  day: number; // 1 to 5 (June 15 to June 19)
  dateString: string; // e.g. "June 15, 2026"
  title: string;
  time: string;
  category: "keynote" | "committee" | "workshop" | "social" | "general-assembly";
  room: string;
  description: string;
  speakers?: Speaker[];
}

export interface Speaker {
  name: string;
  role: string;
  organization: string;
  avatarUrl?: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  category: "technical" | "administrative" | "logistics" | "legal";
  description: string;
  size: string;
  pages?: string;
  revision?: string;
  language?: string;
  updatedAt: string;
  fileType: "PDF" | "IMG" | "DOCX";
  downloadUrl: string;
  contentSnippet?: string; // Standard snippet for the interactive Document Reader
}

export interface Hotel {
  id: string;
  name: string;
  address: string;
  stars: number;
  pricePerNight: string;
  distanceToVenue: string;
  description: string;
  bookingUrl: string;
}

export interface ShuttleTime {
  id: string;
  from: string;
  to: string;
  timeString: string;
  frequency: string;
  notes: string;
}

export interface AttendeeProfile {
  email: string;
  fullName: string;
  organization: string;
  role: string;
  country: string;
  badgeCode: string; // generated QR/bar mockup
  dietaryPreferences: string;
  galaAttendance: "attending" | "declined" | "pending";
  phoneNumber?: string;
  isAdmin?: boolean;
}

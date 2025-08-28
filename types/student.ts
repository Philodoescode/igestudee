export type StudentRoster = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  dob: string | null; // YYYY-MM-DD
  gender: 'Male' | 'Female' | null;
  joinedAt: string; // ISO string
  guardianName: string | null;
  groups: string[];
};

export type GuardianProfile = {
  full_name: string;
  job_title: string;
  relationship: string;
  phone_number: string;
}
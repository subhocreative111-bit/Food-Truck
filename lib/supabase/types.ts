/**
 * Hand-written database type shims for the Phase 1 schema.
 * Mirrors supabase/migrations/0001_initial.sql.
 */

export type ClaimStatus = 'pending' | 'approved' | 'rejected';

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  is_admin: boolean;
  created_at: string;
}

export interface Claim {
  id: string;
  truck_slug: string;
  truck_name: string;
  city: string | null;
  state: string | null;
  cuisine: string | null;
  user_id: string | null;
  applicant_email: string;
  applicant_name: string | null;
  applicant_phone: string | null;
  message: string | null;
  status: ClaimStatus;
  reviewed_at: string | null;
  reviewed_by: string | null;
  reviewer_note: string | null;
  created_at: string;
}

export interface TruckOverride {
  truck_slug: string;
  owner_id: string;
  display_name: string | null;
  description: string | null;
  phone: string | null;
  website: string | null;
  instagram: string | null;
  hours_json: Record<string, string> | null;
  cuisines: string[] | null;
  is_featured: boolean;
  is_published: boolean;
  updated_at: string;
}

export interface Photo {
  id: string;
  truck_slug: string;
  owner_id: string;
  storage_path: string;
  public_url: string;
  caption: string | null;
  sort_order: number;
  is_approved: boolean;
  created_at: string;
}

export interface Submission {
  id: string;
  kind: 'contact' | 'press' | 'feedback' | string;
  name: string | null;
  email: string | null;
  subject: string | null;
  message: string;
  meta: Record<string, unknown> | null;
  handled: boolean;
  created_at: string;
}

export type UserRole = "user" | "qa" | "apo" | "dean" | "admin";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  program?: string;
  department?: string;
  avatar?: string;
  last_active?: string;
  permissions: string[];
}

export interface Question {
  id: number;
  title: string;
  body: string;
  status: "draft" | "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
  author_id: number;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  views: number;
  answers_count: number;
}

export interface DashboardStats {
  total_questions: number;
  pending_reviews: number;
  approved_questions: number;
  active_users: number;
  completion_rate: number;
  recent_activity: Array<{
    id: number;
    action: string;
    user: string;
    timestamp: string;
  }>;
}

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  user: ["view_own_questions", "create_questions"],
  qa: ["view_all_questions", "review_questions", "approve_questions", "view_own_questions", "create_questions", "edit_questions", "delete_questions"],
  apo: ["view_all_questions", "view_analytics", "manage_programs", "view_reports"],
  dean: ["view_all_questions", "view_analytics", "manage_faculty", "view_reports", "approve_programs"],
  admin: ["*"],
};

export const ROLE_COLORS: Record<UserRole, string> = {
  admin: "red",
  dean: "orange",
  apo: "green",
  qa: "blue",
  user: "gray",
};

export const STATUS_COLORS: Record<string, string> = {
  draft: "gray",
  pending: "yellow",
  approved: "green",
  rejected: "red",
};


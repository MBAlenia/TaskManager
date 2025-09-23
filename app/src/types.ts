export interface Task {
  id: number;
  title: string;
  description: string;
  points: number;
  level: number;
  status: string;
  creator_id: number;
  assignee_id: number | null;
  category_id: number | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  parent_id: number | null;
}

export interface User {
  id: number;
  username: string;
  level: number;
}

export interface Comment {
  id: number;
  content: string;
  user_id: number;
  task_id: number;
  created_at: string;
  updated_at: string;
}
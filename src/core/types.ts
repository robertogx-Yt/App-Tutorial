export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  dueDate?: string; // YYYY-MM-DD
  priority: TaskPriority;
  estimatedMinutes: number;
  completed: boolean;
}

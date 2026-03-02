import type { Task, TaskPriority } from "./types";

const PRIORITY_WEIGHT: Record<TaskPriority, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

function getDueDateWeight(dueDate?: string): number {
  if (!dueDate) {
    return 0;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(`${dueDate}T00:00:00`);
  const diffMs = due.getTime() - today.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return 3;
  if (diffDays <= 1) return 2;
  if (diffDays <= 3) return 1;
  return 0;
}

function getDurationPenalty(estimatedMinutes: number): number {
  if (estimatedMinutes <= 30) return 0;
  if (estimatedMinutes <= 60) return 0.25;
  if (estimatedMinutes <= 120) return 0.5;
  return 1;
}

export function scoreTask(task: Task): number {
  const priority = PRIORITY_WEIGHT[task.priority] * 2;
  const dueDateWeight = getDueDateWeight(task.dueDate);
  const durationPenalty = getDurationPenalty(task.estimatedMinutes);

  return priority + dueDateWeight - durationPenalty;
}

export function buildTodayPlan(tasks: Task[], limit = 3): Task[] {
  return tasks
    .filter((task) => !task.completed)
    .sort((a, b) => scoreTask(b) - scoreTask(a))
    .slice(0, limit);
}

import { buildTodayPlan, scoreTask } from "../src/core/planner";
import type { Task } from "../src/core/types";

function inDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

describe("scoreTask", () => {
  it("prioriza tareas altas y urgentes", () => {
    const highUrgent: Task = {
      id: "1",
      title: "Enviar propuesta",
      priority: "high",
      dueDate: inDays(0),
      estimatedMinutes: 30,
      completed: false,
    };

    const lowNoDate: Task = {
      id: "2",
      title: "Ordenar archivos",
      priority: "low",
      estimatedMinutes: 30,
      completed: false,
    };

    expect(scoreTask(highUrgent)).toBeGreaterThan(scoreTask(lowNoDate));
  });
});

describe("buildTodayPlan", () => {
  it("devuelve máximo 3 tareas no completadas ordenadas por score", () => {
    const tasks: Task[] = [
      { id: "1", title: "A", priority: "low", estimatedMinutes: 20, completed: false },
      { id: "2", title: "B", priority: "high", dueDate: inDays(1), estimatedMinutes: 40, completed: false },
      { id: "3", title: "C", priority: "medium", dueDate: inDays(0), estimatedMinutes: 25, completed: false },
      { id: "4", title: "D", priority: "high", estimatedMinutes: 200, completed: false },
      { id: "5", title: "E", priority: "high", estimatedMinutes: 20, completed: true }
    ];

    const plan = buildTodayPlan(tasks);

    expect(plan).toHaveLength(3);
    expect(plan.find((task) => task.id === "5")).toBeUndefined();

    for (let i = 0; i < plan.length - 1; i++) {
      expect(scoreTask(plan[i])).toBeGreaterThanOrEqual(scoreTask(plan[i + 1]));
    }
  });
});

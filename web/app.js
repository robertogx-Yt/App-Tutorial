const tasks = [
  { id: "1", title: "Enviar propuesta", priority: "high", dueToday: true, completed: false, estimatedMinutes: 30 },
  { id: "2", title: "Preparar demo", priority: "high", dueToday: false, completed: false, estimatedMinutes: 45 },
  { id: "3", title: "Ordenar notas", priority: "low", dueToday: false, completed: true, estimatedMinutes: 20 },
  { id: "4", title: "Responder correos", priority: "medium", dueToday: true, completed: false, estimatedMinutes: 25 },
  { id: "5", title: "Revisión semanal", priority: "medium", dueToday: false, completed: false, estimatedMinutes: 70 },
];

function scoreTask(task) {
  const priorityWeight = { low: 2, medium: 4, high: 6 }[task.priority];
  const dueWeight = task.dueToday ? 3 : 0;
  const durationPenalty = task.estimatedMinutes > 60 ? 1 : 0;
  return priorityWeight + dueWeight - durationPenalty;
}

function buildPlan(limit = 3) {
  return [...tasks]
    .filter((t) => !t.completed)
    .sort((a, b) => scoreTask(b) - scoreTask(a))
    .slice(0, limit);
}

function renderBars(containerId, data, color) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  const max = Math.max(...Object.values(data), 1);
  Object.entries(data).forEach(([label, value]) => {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = `${(value / max) * 100}%`;
    bar.style.background = color;
    bar.innerHTML = `<span>${label} (${value})</span>`;
    container.appendChild(bar);
  });
}

function render() {
  const plan = buildPlan();
  document.getElementById("taskList").innerHTML = plan
    .map((t) => `<li><b>${t.title}</b> · ${t.priority} · score ${scoreTask(t)}</li>`)
    .join("");

  const xp = plan.reduce((acc, t) => acc + (t.priority === "high" ? 20 : t.priority === "medium" ? 15 : 10), 0);
  const level = Math.floor(xp / 100) + 1;
  const pct = Math.min(100, xp % 100);

  document.getElementById("xpInfo").textContent = `XP de hoy: ${xp} · Nivel: ${level}`;
  document.getElementById("xpBar").style.width = `${pct}%`;

  const priorityStats = { high: 0, medium: 0, low: 0 };
  const statusStats = { pending: 0, completed: 0, dueToday: 0 };
  tasks.forEach((t) => {
    priorityStats[t.priority] += 1;
    if (t.completed) statusStats.completed += 1;
    else statusStats.pending += 1;
    if (t.dueToday) statusStats.dueToday += 1;
  });

  renderBars("priorityChart", priorityStats, "#7c3aed");
  renderBars("statusChart", statusStats, "#22d3ee");
}

document.getElementById("buildPlan").addEventListener("click", render);
render();

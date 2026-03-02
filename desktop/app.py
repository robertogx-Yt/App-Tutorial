#!/usr/bin/env python3
import tkinter as tk
from tkinter import ttk

TASKS = [
    {"title": "Enviar propuesta", "priority": "high", "due_today": True, "completed": False, "minutes": 30},
    {"title": "Preparar demo", "priority": "high", "due_today": False, "completed": False, "minutes": 45},
    {"title": "Ordenar notas", "priority": "low", "due_today": False, "completed": True, "minutes": 20},
    {"title": "Responder correos", "priority": "medium", "due_today": True, "completed": False, "minutes": 25},
    {"title": "Revisión semanal", "priority": "medium", "due_today": False, "completed": False, "minutes": 70},
]


def score_task(task):
    p = {"low": 2, "medium": 4, "high": 6}[task["priority"]]
    d = 3 if task["due_today"] else 0
    penalty = 1 if task["minutes"] > 60 else 0
    return p + d - penalty


def build_plan(limit=3):
    pending = [t for t in TASKS if not t["completed"]]
    pending.sort(key=score_task, reverse=True)
    return pending[:limit]


def calc_xp(plan):
    xp_map = {"high": 20, "medium": 15, "low": 10}
    return sum(xp_map[t["priority"]] for t in plan)


def draw_bar_chart(canvas, data, color):
    canvas.delete("all")
    width = int(canvas["width"])
    height = int(canvas["height"])
    max_val = max(data.values()) if data else 1
    bar_w = max(40, width // max(1, len(data) * 2))
    x = 20
    for label, value in data.items():
        h = int((value / max_val) * (height - 40)) if max_val else 0
        y0 = height - h - 20
        canvas.create_rectangle(x, y0, x + bar_w, height - 20, fill=color, outline="")
        canvas.create_text(x + bar_w // 2, height - 8, text=f"{label} ({value})", fill="#cbd5e1", font=("Arial", 9))
        x += bar_w + 24


class FocusFlowApp:
    def __init__(self, root):
        self.root = root
        self.root.title("FocusFlow Desktop")
        self.root.geometry("1150x700")
        self.root.configure(bg="#0f172a")

        self.main = tk.Frame(root, bg="#0f172a")
        self.main.pack(fill="both", expand=True)

        self.build_sidebar()
        self.build_content()
        self.render()

    def build_sidebar(self):
        sidebar = tk.Frame(self.main, bg="#111827", width=220)
        sidebar.pack(side="left", fill="y")
        sidebar.pack_propagate(False)

        tk.Label(sidebar, text="FocusFlow", fg="white", bg="#111827", font=("Arial", 18, "bold")).pack(pady=20)
        for label in ["Hoy", "Tareas", "Progreso", "Ajustes"]:
            tk.Button(sidebar, text=label, relief="flat", bg="#1f2937", fg="#e2e8f0", activebackground="#7c3aed", activeforeground="white").pack(fill="x", padx=16, pady=6, ipady=7)

    def build_content(self):
        content = tk.Frame(self.main, bg="#0f172a")
        content.pack(side="left", fill="both", expand=True, padx=14, pady=14)

        top = tk.Frame(content, bg="#0f172a")
        top.pack(fill="x")
        tk.Label(top, text="Plan de Hoy", fg="white", bg="#0f172a", font=("Arial", 20, "bold")).pack(side="left")
        tk.Button(top, text="Generar plan", command=self.render, bg="#22c55e", fg="#0b1020", relief="flat").pack(side="right")

        cards = tk.Frame(content, bg="#0f172a")
        cards.pack(fill="both", expand=True, pady=(12, 0))

        left_card = tk.Frame(cards, bg="#111827", bd=1, relief="solid")
        left_card.pack(side="left", fill="both", expand=True, padx=(0, 8))
        tk.Label(left_card, text="Tareas principales", fg="white", bg="#111827", font=("Arial", 12, "bold")).pack(anchor="w", padx=12, pady=12)
        self.task_list = tk.Listbox(left_card, bg="#0b1220", fg="#e2e8f0", bd=0, highlightthickness=0, font=("Consolas", 11))
        self.task_list.pack(fill="both", expand=True, padx=12, pady=(0, 12))

        right_card = tk.Frame(cards, bg="#111827", bd=1, relief="solid", width=320)
        right_card.pack(side="left", fill="y")
        right_card.pack_propagate(False)

        tk.Label(right_card, text="Gamificación", fg="white", bg="#111827", font=("Arial", 12, "bold")).pack(anchor="w", padx=12, pady=(12, 8))
        self.xp_label = tk.Label(right_card, text="XP: 0", fg="#a5b4fc", bg="#111827", font=("Arial", 11, "bold"))
        self.xp_label.pack(anchor="w", padx=12)
        self.level_label = tk.Label(right_card, text="Nivel: 1", fg="#93c5fd", bg="#111827", font=("Arial", 11, "bold"))
        self.level_label.pack(anchor="w", padx=12, pady=(4, 2))

        tk.Label(right_card, text="Resumen IA (keywords)", fg="white", bg="#111827", font=("Arial", 11, "bold")).pack(anchor="w", padx=12, pady=(14, 6))
        self.input_text = tk.Text(right_card, height=5, bg="#0b1220", fg="#e2e8f0", insertbackground="white", bd=0)
        self.input_text.pack(fill="x", padx=12)
        tk.Button(right_card, text="Resumir", bg="#7c3aed", fg="white", relief="flat", command=self.summarize).pack(anchor="w", padx=12, pady=8)
        self.summary_label = tk.Label(right_card, text="", fg="#cbd5e1", bg="#111827", justify="left", wraplength=280)
        self.summary_label.pack(anchor="w", padx=12)

        charts = tk.Frame(content, bg="#0f172a")
        charts.pack(fill="x", pady=(10, 0))
        chart1 = tk.Frame(charts, bg="#111827", bd=1, relief="solid")
        chart1.pack(side="left", fill="x", expand=True, padx=(0, 8))
        chart2 = tk.Frame(charts, bg="#111827", bd=1, relief="solid")
        chart2.pack(side="left", fill="x", expand=True)

        tk.Label(chart1, text="Gráfico por prioridad", fg="white", bg="#111827", font=("Arial", 11, "bold")).pack(anchor="w", padx=10, pady=8)
        self.priority_canvas = tk.Canvas(chart1, bg="#0b1220", width=420, height=180, highlightthickness=0)
        self.priority_canvas.pack(fill="x", padx=10, pady=(0, 10))

        tk.Label(chart2, text="Gráfico por estado", fg="white", bg="#111827", font=("Arial", 11, "bold")).pack(anchor="w", padx=10, pady=8)
        self.status_canvas = tk.Canvas(chart2, bg="#0b1220", width=420, height=180, highlightthickness=0)
        self.status_canvas.pack(fill="x", padx=10, pady=(0, 10))

    def summarize(self):
        text = self.input_text.get("1.0", "end").strip().lower()
        if not text:
            self.summary_label.config(text="Sin contenido suficiente para resumir")
            return
        words = [w for w in text.replace("\n", " ").split(" ") if len(w) > 3]
        top = ", ".join(words[:8]) if words else "Sin contenido suficiente para resumir"
        self.summary_label.config(text=f"Resumen IA (keywords): {top}")

    def render(self):
        plan = build_plan(3)
        self.task_list.delete(0, tk.END)
        for t in plan:
            self.task_list.insert(tk.END, f"{t['title']} | {t['priority']} | score {score_task(t)}")

        xp = calc_xp(plan)
        level = xp // 100 + 1
        self.xp_label.config(text=f"XP: {xp}")
        self.level_label.config(text=f"Nivel: {level}")

        priority = {"high": 0, "medium": 0, "low": 0}
        status = {"pending": 0, "completed": 0, "dueToday": 0}
        for t in TASKS:
            priority[t["priority"]] += 1
            if t["completed"]:
                status["completed"] += 1
            else:
                status["pending"] += 1
            if t["due_today"]:
                status["dueToday"] += 1

        draw_bar_chart(self.priority_canvas, priority, "#7c3aed")
        draw_bar_chart(self.status_canvas, status, "#22d3ee")


if __name__ == "__main__":
    root = tk.Tk()
    style = ttk.Style()
    try:
        style.theme_use("clam")
    except tk.TclError:
        pass
    FocusFlowApp(root)
    root.mainloop()

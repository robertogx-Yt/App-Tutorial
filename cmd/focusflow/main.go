package main

import (
	"flag"
	"fmt"
	"time"

	"focusflow/internal/ai"
	"focusflow/internal/gamification"
	"focusflow/internal/planner"
)

func main() {
	mode := flag.String("mode", "demo", "demo | summary")
	text := flag.String("text", "", "texto para resumir (mode=summary)")
	flag.Parse()

	switch *mode {
	case "summary":
		fmt.Println(ai.SummarizeText(*text, 8))
	default:
		runDemo()
	}
}

func runDemo() {
	now := time.Now()
	dueToday := now
	dueTomorrow := now.AddDate(0, 0, 1)

	tasks := []planner.Task{
		{ID: "1", Title: "Enviar propuesta", DueDate: &dueToday, Priority: planner.High, EstimatedMinutes: 30},
		{ID: "2", Title: "Preparar demo", DueDate: &dueTomorrow, Priority: planner.High, EstimatedMinutes: 45},
		{ID: "3", Title: "Ordenar notas", Priority: planner.Low, EstimatedMinutes: 20},
		{ID: "4", Title: "Responder correos", Priority: planner.Medium, EstimatedMinutes: 25},
	}

	plan := planner.BuildTodayPlan(tasks, now, 3)
	fmt.Println("=== Plan de Hoy (Top 3) ===")
	totalXP := 0
	for i, task := range plan {
		score := planner.ScoreTask(task, now)
		xp := gamification.CalculateXP(task)
		totalXP += xp
		fmt.Printf("%d) %s | prioridad=%s | score=%.2f | xp=%d\n", i+1, task.Title, task.Priority, score, xp)
	}

	level := gamification.CalculateLevel(totalXP)
	badges := gamification.AwardBadges(3, len(plan))
	fmt.Printf("\nXP ganado hoy: %d | Nivel estimado: %d\n", totalXP, level)
	if len(badges) == 0 {
		fmt.Println("Badges: aún no desbloqueados")
	} else {
		fmt.Println("Badges desbloqueados:")
		for _, b := range badges {
			fmt.Printf("- %s: %s\n", b.Name, b.Description)
		}
	}
}

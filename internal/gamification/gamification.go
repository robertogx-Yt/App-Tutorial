package gamification

import "focusflow/internal/planner"

type Badge struct {
	Name        string
	Description string
}

type SessionResult struct {
	CompletedTasks int
	XPGained       int
	Level          int
	Badges         []Badge
}

func CalculateXP(task planner.Task) int {
	base := 10
	switch task.Priority {
	case planner.High:
		base += 10
	case planner.Medium:
		base += 5
	}

	if task.EstimatedMinutes > 60 {
		base += 5
	}
	return base
}

func CalculateLevel(totalXP int) int {
	if totalXP < 0 {
		return 1
	}
	return (totalXP / 100) + 1
}

func AwardBadges(streakDays int, completedToday int) []Badge {
	badges := []Badge{}
	if completedToday >= 3 {
		badges = append(badges, Badge{Name: "Focus 3", Description: "Completaste 3 tareas en un día"})
	}
	if streakDays >= 7 {
		badges = append(badges, Badge{Name: "Semana Imparable", Description: "7 días seguidos cumpliendo tu plan"})
	}
	return badges
}

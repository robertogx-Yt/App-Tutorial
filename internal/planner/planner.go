package planner

import (
	"sort"
	"time"
)

type TaskPriority string

const (
	Low    TaskPriority = "low"
	Medium TaskPriority = "medium"
	High   TaskPriority = "high"
)

type Task struct {
	ID               string
	Title            string
	DueDate          *time.Time
	Priority         TaskPriority
	EstimatedMinutes int
	Completed        bool
}

var priorityWeight = map[TaskPriority]float64{
	Low:    1,
	Medium: 2,
	High:   3,
}

func dueDateWeight(dueDate *time.Time, now time.Time) float64 {
	if dueDate == nil {
		return 0
	}

	today := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	due := time.Date(dueDate.Year(), dueDate.Month(), dueDate.Day(), 0, 0, 0, 0, dueDate.Location())
	diffDays := int(due.Sub(today).Hours() / 24)

	switch {
	case diffDays <= 0:
		return 3
	case diffDays <= 1:
		return 2
	case diffDays <= 3:
		return 1
	default:
		return 0
	}
}

func durationPenalty(minutes int) float64 {
	switch {
	case minutes <= 30:
		return 0
	case minutes <= 60:
		return 0.25
	case minutes <= 120:
		return 0.5
	default:
		return 1
	}
}

func ScoreTask(task Task, now time.Time) float64 {
	priority := priorityWeight[task.Priority] * 2
	return priority + dueDateWeight(task.DueDate, now) - durationPenalty(task.EstimatedMinutes)
}

func BuildTodayPlan(tasks []Task, now time.Time, limit int) []Task {
	filtered := make([]Task, 0, len(tasks))
	for _, t := range tasks {
		if !t.Completed {
			filtered = append(filtered, t)
		}
	}

	sort.Slice(filtered, func(i, j int) bool {
		return ScoreTask(filtered[i], now) > ScoreTask(filtered[j], now)
	})

	if limit <= 0 || limit > len(filtered) {
		limit = len(filtered)
	}

	return filtered[:limit]
}

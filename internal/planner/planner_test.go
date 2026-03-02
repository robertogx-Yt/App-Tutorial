package planner

import (
	"testing"
	"time"
)

func TestScoreTaskPrioritizesUrgentHigh(t *testing.T) {
	now := time.Date(2026, 3, 2, 8, 0, 0, 0, time.UTC)
	due := now

	highUrgent := Task{ID: "1", Title: "urgent", Priority: High, DueDate: &due, EstimatedMinutes: 30}
	low := Task{ID: "2", Title: "low", Priority: Low, EstimatedMinutes: 30}

	if ScoreTask(highUrgent, now) <= ScoreTask(low, now) {
		t.Fatal("expected urgent high task to have a bigger score")
	}
}

func TestBuildTodayPlanFiltersAndLimits(t *testing.T) {
	now := time.Date(2026, 3, 2, 8, 0, 0, 0, time.UTC)
	due := now
	tasks := []Task{
		{ID: "1", Priority: Low, EstimatedMinutes: 20},
		{ID: "2", Priority: High, DueDate: &due, EstimatedMinutes: 40},
		{ID: "3", Priority: Medium, EstimatedMinutes: 25},
		{ID: "4", Priority: High, EstimatedMinutes: 200},
		{ID: "5", Priority: High, EstimatedMinutes: 20, Completed: true},
	}

	plan := BuildTodayPlan(tasks, now, 3)
	if len(plan) != 3 {
		t.Fatalf("expected 3 tasks, got %d", len(plan))
	}
	for _, task := range plan {
		if task.ID == "5" {
			t.Fatal("completed task should not be included")
		}
	}
}

package gamification

import (
	"focusflow/internal/planner"
	"testing"
)

func TestCalculateLevel(t *testing.T) {
	if got := CalculateLevel(0); got != 1 {
		t.Fatalf("expected level 1, got %d", got)
	}
	if got := CalculateLevel(250); got != 3 {
		t.Fatalf("expected level 3, got %d", got)
	}
}

func TestAwardBadges(t *testing.T) {
	badges := AwardBadges(7, 3)
	if len(badges) < 2 {
		t.Fatalf("expected at least 2 badges, got %d", len(badges))
	}

	xp := CalculateXP(planner.Task{Priority: planner.High, EstimatedMinutes: 80})
	if xp <= 20 {
		t.Fatalf("expected high priority long task xp > 20, got %d", xp)
	}
}

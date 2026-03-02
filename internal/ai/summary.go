package ai

import (
	"regexp"
	"sort"
	"strings"
)

var stopWords = map[string]struct{}{
	"de": {}, "la": {}, "el": {}, "y": {}, "en": {}, "para": {}, "con": {}, "un": {}, "una": {},
}

func SummarizeText(input string, maxWords int) string {
	clean := strings.ToLower(input)
	re := regexp.MustCompile(`[^a-záéíóúñ0-9\s]`)
	clean = re.ReplaceAllString(clean, " ")

	freq := map[string]int{}
	for _, w := range strings.Fields(clean) {
		if _, stop := stopWords[w]; stop || len(w) <= 2 {
			continue
		}
		freq[w]++
	}

	type pair struct {
		word  string
		count int
	}
	pairs := make([]pair, 0, len(freq))
	for w, c := range freq {
		pairs = append(pairs, pair{w, c})
	}

	sort.Slice(pairs, func(i, j int) bool { return pairs[i].count > pairs[j].count })
	if maxWords <= 0 {
		maxWords = 8
	}
	if len(pairs) > maxWords {
		pairs = pairs[:maxWords]
	}

	out := make([]string, 0, len(pairs))
	for _, p := range pairs {
		out = append(out, p.word)
	}
	if len(out) == 0 {
		return "Sin contenido suficiente para resumir"
	}
	return "Resumen IA (keywords): " + strings.Join(out, ", ")
}

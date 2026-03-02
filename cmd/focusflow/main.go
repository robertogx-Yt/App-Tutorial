package main

import (
	"flag"
	"fmt"
	"os"
	"os/exec"

	"focusflow/internal/ai"
)

func main() {
	mode := flag.String("mode", "window", "window | summary")
	text := flag.String("text", "", "texto para resumir (mode=summary)")
	flag.Parse()

	switch *mode {
	case "summary":
		fmt.Println(ai.SummarizeText(*text, 8))
	default:
		if err := runDesktopWindow(); err != nil {
			fmt.Fprintf(os.Stderr, "No se pudo abrir la ventana de escritorio: %v\n", err)
			os.Exit(1)
		}
	}
}

func runDesktopWindow() error {
	cmd := exec.Command("python3", "desktop/app.py")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Stdin = os.Stdin
	return cmd.Run()
}

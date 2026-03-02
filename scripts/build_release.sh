#!/usr/bin/env bash
set -euo pipefail

mkdir -p dist

echo "[1/2] Running tests"
go test ./...

echo "[2/2] Building Windows executable"
GOOS=windows GOARCH=amd64 go build -o dist/focusflow.exe ./cmd/focusflow

echo "Release artifact generated: dist/focusflow.exe"

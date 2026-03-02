#!/usr/bin/env bash
set -euo pipefail

echo "[1/2] Running tests"
go test ./...

echo "[2/2] Verifying repository has no tracked binary artifacts"
python3 scripts/check_no_binary.py

echo "Release check completed (source-only release, no binary artifacts tracked)."

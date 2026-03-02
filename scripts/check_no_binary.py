#!/usr/bin/env python3
from pathlib import Path
import subprocess
import sys


def is_binary(path: Path) -> bool:
    data = path.read_bytes()
    if b"\x00" in data:
        return True
    # allow utf text; if decode fails treat as binary
    try:
        data.decode("utf-8")
        return False
    except UnicodeDecodeError:
        return True


def main() -> int:
    result = subprocess.run(["git", "ls-files"], check=True, capture_output=True, text=True)
    files = [Path(line.strip()) for line in result.stdout.splitlines() if line.strip()]

    binary_files = []
    for f in files:
        if not f.exists() or f.is_dir():
            continue
        if is_binary(f):
            binary_files.append(str(f))

    if binary_files:
        print("Binary files detected:")
        for b in binary_files:
            print(f"- {b}")
        return 1

    print("No tracked binary files detected.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

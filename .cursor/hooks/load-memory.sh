#!/bin/bash
# Inject .cursor/memory.md at session start.
set -euo pipefail
cd "$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
python3 - <<'PY'
import json
import pathlib
import sys

try:
    json.load(sys.stdin)
except Exception:
    pass

mem = pathlib.Path(".cursor/memory.md")
if not mem.is_file():
    print("{}")
    raise SystemExit(0)

text = mem.read_text(encoding="utf-8").strip()
if not text:
    print("{}")
    raise SystemExit(0)

print(json.dumps({"additional_context": "Project memory (.cursor/memory.md):\n\n" + text}, ensure_ascii=False))
PY

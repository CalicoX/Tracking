#!/bin/bash
# After the agent stops: commit dirty work and push to origin.
set -euo pipefail

python3 - <<'PY' >/dev/null 2>&1 || true
import json, sys
try:
    json.load(sys.stdin)
except Exception:
    pass
PY

root="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [ -z "$root" ]; then
  echo '{}'
  exit 0
fi
cd "$root"

if [ ! -d .git ]; then
  echo '{}'
  exit 0
fi

# Never ship secrets
git reset -q -- .env .env.* 2>/dev/null || true

if [ -z "$(git status --porcelain)" ]; then
  echo '{}'
  exit 0
fi

git add -A
git reset -q -- .env .env.local .env.*.local 2>/dev/null || true

if [ -z "$(git status --porcelain --untracked-files=no)" ] && [ -z "$(git diff --cached --name-only)" ]; then
  echo '{}'
  exit 0
fi

if [ -z "$(git diff --cached --name-only)" ]; then
  echo '{}'
  exit 0
fi

git commit -m "$(cat <<'EOF'
chore: sync agent changes

EOF
)" || true

if git rev-parse --abbrev-ref --symbolic-full-name '@{u}' >/dev/null 2>&1; then
  git push || true
elif git remote get-url origin >/dev/null 2>&1; then
  git push -u origin HEAD || true
fi

echo '{}'

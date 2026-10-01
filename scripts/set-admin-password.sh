#!/usr/bin/env bash
# Set a new password for an existing Lessora admin account.
# Usage (from anywhere): bash scripts/set-admin-password.sh
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

if [ ! -f .env ]; then
  echo "No .env file in $repo_root. It must contain MONGODB_URI." >&2
  exit 1
fi

node --env-file=.env scripts/set-admin-password.mjs

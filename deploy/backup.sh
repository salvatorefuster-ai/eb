#!/usr/bin/env bash
# Backup data + uploads + .env
# Cron ejemplo: 0 3 * * * /ruta/escort-benidorm/deploy/backup.sh

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
STAMP="$(date +%Y%m%d-%H%M%S)"
DEST="${BACKUP_DIR:-$ROOT/backups}/eb-$STAMP"
mkdir -p "$DEST"
cp -a "$ROOT/data" "$DEST/" 2>/dev/null || true
cp -a "$ROOT/uploads" "$DEST/" 2>/dev/null || true
cp -a "$ROOT/.env" "$DEST/" 2>/dev/null || true
# comprimir
tar -czf "${DEST}.tgz" -C "$(dirname "$DEST")" "$(basename "$DEST")"
rm -rf "$DEST"
# retener 14 días
find "${BACKUP_DIR:-$ROOT/backups}" -name 'eb-*.tgz' -mtime +14 -delete 2>/dev/null || true
echo "Backup OK → ${DEST}.tgz"

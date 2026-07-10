#!/usr/bin/env bash
# Backup de la base de datos.
# - Desarrollo (SQLite): copia dev.db con timestamp a ./backups
# - Producción (PostgreSQL): usa pg_dump con la URL en DATABASE_URL
# Los datos de pacientes y fichas clínicas son sensibles: guardá los backups
# cifrados y en un almacenamiento privado (no en el repo).
set -euo pipefail

cd "$(dirname "$0")/.."
mkdir -p backups
STAMP=$(date +%Y%m%d-%H%M%S)

DATABASE_URL="${DATABASE_URL:-file:./dev.db}"

if [[ "$DATABASE_URL" == file:* ]]; then
  SRC="${DATABASE_URL#file:}"
  cp "$SRC" "backups/dev-$STAMP.db"
  echo "Backup SQLite: backups/dev-$STAMP.db"
else
  pg_dump "$DATABASE_URL" --format=custom --file="backups/db-$STAMP.dump"
  echo "Backup PostgreSQL: backups/db-$STAMP.dump"
fi

# Retención simple: conservar los últimos 30 backups
ls -t backups | tail -n +31 | while read -r f; do rm -f "backups/$f"; done

#!/bin/bash

# CONFIG
DB_HOST="localhost"
DB_USER="mirai.klasso"
DB_PASS="los18miraiyco"
DB_NAME="db_mirai.klasso"
BACKUP_DIR="../backups"

# Crear carpeta si no existe
mkdir -p "$BACKUP_DIR"

# Fecha
DATE=$(date +"%Y-%m-%d_%H-%M-%S")

# Archivo destino
SQL_FILE="$BACKUP_DIR/db_mirai.klasso_$DATE.sql"

# Dump de DB
mysqldump -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" > "$SQL_FILE"

# Verificar resultado
if [ $? -eq 0 ]; then
  echo "✅ Backup de base de datos creado: $SQL_FILE"
else
  echo "❌ Error al crear el backup de la BD"
  exit 1
fi

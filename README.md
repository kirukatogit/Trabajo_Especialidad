# Trabajo_Especialidad

Estructura base del proyecto con DB init, CI que valida db/init.sql, y placeholders para docs y entregables.

- Levantar local (con postgres local en docker-compose):
  cp .env.example .env
  docker compose up -d

- CI valida que db/init.sql crea esquema y dos tenants.
# 🔄 Guía de Migración de Datos - Replit → Docker

Esta guía te explica cómo migrar todos los datos de tu base de datos actual (Replit/Neon) a tu entorno Docker local.

---

## 📦 Archivo de Migración Incluido

Ya tenés un archivo listo para importar:

```
📄 database-migration.sql
   - 1017 líneas de código SQL
   - Incluye estructura completa (11 tablas)
   - Incluye todos los datos existentes
   - Formato: PostgreSQL dump estándar
```

**Tablas incluidas:**
- ✅ `evento` (eventos creados)
- ✅ `evento_extra` (relación eventos-extras)
- ✅ `extra` (extras disponibles)
- ✅ `insumo` (insumos de cocina)
- ✅ `menu` (menús)
- ✅ `menu_insumo` (relación menús-insumos)
- ✅ `orden_compra` (órdenes de compra)
- ✅ `orden_compra_detalle` (detalle de órdenes)
- ✅ `prov_insumo` (relación proveedores-insumos)
- ✅ `proveedor` (proveedores)
- ✅ `usuario` (usuarios del sistema)

---

## 🚀 Opción 1: Importación Automática (Más Fácil)

### Paso 1: Levantar solo la base de datos

```bash
docker-compose up -d database
```

Esperá 10 segundos a que PostgreSQL inicie completamente.

### Paso 2: Ejecutar el script de importación

```bash
./docker-import-data.sh
```

**¡Listo!** El script hace todo automáticamente:
- ✅ Verifica que Docker esté corriendo
- ✅ Verifica que el archivo exista
- ✅ Levanta la base de datos si no está corriendo
- ✅ Importa todos los datos
- ✅ Muestra un resumen de las tablas

### Paso 3: Levantar el resto de los servicios

```bash
docker-compose up -d
```

Ahora podés abrir http://localhost y ver todos tus datos.

---

## 🛠️ Opción 2: Importación Manual

Si preferís hacerlo paso a paso:

### Paso 1: Levantar Docker Compose

```bash
docker-compose up -d
```

### Paso 2: Importar el dump

```bash
docker exec -i saveur-database psql -U eventos_user -d eventos_db < database-migration.sql
```

### Paso 3: Verificar

```bash
docker exec -i saveur-database psql -U eventos_user -d eventos_db -c "\dt"
```

Deberías ver las 11 tablas listadas.

---

## 🔍 Verificar que los Datos se Importaron

### Contar registros en cada tabla:

```bash
docker exec -i saveur-database psql -U eventos_user -d eventos_db << EOF
SELECT 'eventos' as tabla, COUNT(*) FROM evento
UNION ALL
SELECT 'menus', COUNT(*) FROM menu
UNION ALL
SELECT 'insumos', COUNT(*) FROM insumo
UNION ALL
SELECT 'extras', COUNT(*) FROM extra
UNION ALL
SELECT 'proveedores', COUNT(*) FROM proveedor
UNION ALL
SELECT 'usuarios', COUNT(*) FROM usuario
UNION ALL
SELECT 'ordenes_compra', COUNT(*) FROM orden_compra;
EOF
```

### Ver datos de ejemplo:

```bash
# Ver eventos
docker exec -i saveur-database psql -U eventos_user -d eventos_db \
  -c "SELECT id_evento, nombre_cliente, fecha FROM evento LIMIT 5;"

# Ver menús
docker exec -i saveur-database psql -U eventos_user -d eventos_db \
  -c "SELECT id_menu, nombre, primer_plato FROM menu;"

# Ver usuarios
docker exec -i saveur-database psql -U eventos_user -d eventos_db \
  -c "SELECT id_usuario, username, rol FROM usuario;"
```

---

## 🔄 Regenerar el Archivo de Migración (Si Agregaste Datos Nuevos)

Si hiciste cambios en Replit y querés volver a exportar:

### En Replit (este proyecto):

```bash
pg_dump $DATABASE_URL --no-owner --no-acl --clean --if-exists > database-migration.sql
```

Después descargá el archivo `database-migration.sql` y llevalo a tu carpeta local del proyecto.

---

## ⚠️ Notas Importantes

### ¿Qué incluye el dump?

- ✅ **Estructura de tablas** (CREATE TABLE)
- ✅ **Datos** (INSERT/COPY)
- ✅ **Índices** (CREATE INDEX)
- ✅ **Foreign Keys** (ALTER TABLE)
- ✅ **Constraints** (PRIMARY KEY, UNIQUE)
- ❌ **NO incluye** roles/usuarios de PostgreSQL (por seguridad)

### ¿Es seguro importar múltiples veces?

**Sí.** El archivo incluye `--clean --if-exists`, lo que significa:
- Primero **borra** las tablas si existen
- Después las **recrea** con los nuevos datos

**⚠️ ADVERTENCIA:** Esto **BORRA** todos los datos existentes en Docker antes de importar.

### ¿Los datos en Replit se borran?

**NO.** El dump es solo una **copia** de lectura. Tu base de datos en Replit sigue intacta.

---

## 🔐 Diferencias de Configuración

| Aspecto | Replit (Neon) | Docker Local |
|---------|---------------|--------------|
| **Host** | ep-small-breeze-afu0r3ey.c-2.us-west-2.aws.neon.tech | localhost |
| **Base de datos** | neondb | eventos_db |
| **Usuario** | neondb_owner | eventos_user |
| **Password** | (desde Replit secrets) | eventos_password_secure_123 |
| **Puerto** | 5432 | 5432 |
| **SSL** | Requerido | No requerido |

El backend de Spring Boot automáticamente usa las variables de entorno correctas según el ambiente.

---

## 🐛 Troubleshooting

### Error: "role neondb_owner does not exist"

**Solución:** El dump intenta crear objetos con el usuario de Replit. Ignorá este error, no afecta los datos.

El dump usa `--no-owner` justamente para evitar esto, pero algunos warnings pueden aparecer.

### Error: "database-migration.sql: No such file"

**Solución:** Asegurate de estar en el directorio raíz del proyecto donde está el archivo.

```bash
ls -la database-migration.sql
```

### Error: "could not connect to database"

**Solución:** El contenedor no está corriendo.

```bash
docker-compose up -d database
sleep 10  # Esperar a que inicie
```

### Los datos no aparecen en la app

**Solución:** Reconstruí el backend para que reconecte:

```bash
docker-compose restart backend
```

---

## 📊 Workflow Completo de Migración

```
┌─────────────────────────────────────────────────────────────┐
│ REPLIT (Neon Cloud)                                         │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ PostgreSQL: neondb                                      │ │
│ │ • 11 tablas                                             │ │
│ │ • Datos de producción/desarrollo                        │ │
│ └─────────────────────────────────────────────────────────┘ │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ pg_dump $DATABASE_URL
                     ▼
            ┌─────────────────────┐
            │ database-migration.sql │
            │ (1017 líneas)          │
            └─────────────────────┘
                     │
                     │ docker exec ... psql < database-migration.sql
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ DOCKER LOCAL                                                │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Container: saveur-database                              │ │
│ │ PostgreSQL: eventos_db                                  │ │
│ │ • 11 tablas (idénticas)                                 │ │
│ │ • Mismos datos que Replit                               │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Checklist de Migración Exitosa

Después de importar, verificá:

- [ ] 11 tablas creadas: `docker exec -i saveur-database psql -U eventos_user -d eventos_db -c "\dt"`
- [ ] Datos importados: Ver conteo de registros (query arriba)
- [ ] Backend conecta: `docker-compose logs backend` (sin errores de DB)
- [ ] Frontend funciona: Abrir http://localhost
- [ ] Login funciona: Probar con un usuario existente
- [ ] Eventos visibles: Ir a "Eventos" y ver la lista

---

## 🎯 Resumen Ejecutivo

### Para importar datos de Replit a Docker:

```bash
# Opción rápida (recomendada)
./docker-import-data.sh

# O manual
docker-compose up -d database
sleep 10
docker exec -i saveur-database psql -U eventos_user -d eventos_db < database-migration.sql
docker-compose up -d
```

**¡Listo para trabajar con tus datos en local!** 🎉

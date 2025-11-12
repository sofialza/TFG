# 🐳 SAVEUR EVENTOS - Guía de Docker

Esta guía te explica cómo levantar el sistema completo usando Docker en tu computadora local.

---

## 📋 Prerrequisitos

Antes de empezar, asegurate de tener instalado:

- **Docker Desktop** (versión 20.10 o superior)
  - Windows: [Descargar Docker Desktop para Windows](https://www.docker.com/products/docker-desktop)
  - Mac: [Descargar Docker Desktop para Mac](https://www.docker.com/products/docker-desktop)
  - Linux: `sudo apt install docker.io docker-compose` (Ubuntu/Debian)

- **Docker Compose** (incluido en Docker Desktop)

Verificá la instalación:
```bash
docker --version
docker-compose --version
```

---

## 🚀 Inicio Rápido (5 minutos)

### 1️⃣ Clonar o descargar el proyecto

```bash
git clone <url-del-repo>
cd saveur-eventos
```

### 2️⃣ Configurar variables de entorno

Copia el archivo de ejemplo y editalo si querés cambiar valores:

```bash
cp .env.example .env
```

**Contenido por defecto de `.env`:**
```env
POSTGRES_DB=eventos_db
POSTGRES_USER=eventos_user
POSTGRES_PASSWORD=eventos_password_secure_123
JWT_SECRET=eventos-secret-key-super-secure
```

### 3️⃣ Levantar todos los servicios

```bash
docker-compose up -d
```

Este comando:
- ✅ Descarga las imágenes base (PostgreSQL, Maven, Node, Nginx)
- ✅ Compila el backend (Java + Maven)
- ✅ Compila el frontend (React + Vite)
- ✅ Crea la base de datos PostgreSQL
- ✅ Levanta los 3 servicios en segundo plano

**Esperá 1-2 minutos** mientras se construyen las imágenes (solo la primera vez).

### 4️⃣ Verificar que todo esté corriendo

```bash
docker-compose ps
```

Deberías ver:
```
NAME                STATUS              PORTS
saveur-database     Up (healthy)        0.0.0.0:5432->5432/tcp
saveur-backend      Up (healthy)        0.0.0.0:8080->8080/tcp
saveur-frontend     Up                  0.0.0.0:80->80/tcp
```

### 5️⃣ Abrir el sistema en tu navegador

🌐 **Abrí tu navegador en: http://localhost**

¡Listo! El sistema está corriendo.

---

## 📡 URLs de Acceso

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Frontend** | http://localhost | Interfaz web principal |
| **Backend API** | http://localhost:8080/api | API REST |
| **Base de datos** | localhost:5432 | PostgreSQL (requiere cliente) |

---

## 🛠️ Comandos Útiles

### Ver logs de todos los servicios
```bash
docker-compose logs -f
```

### Ver logs de un servicio específico
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f database
```

### Reiniciar un servicio
```bash
docker-compose restart backend
```

### Detener todos los servicios
```bash
docker-compose down
```

### Detener y eliminar TODOS los datos (⚠️ cuidado)
```bash
docker-compose down -v
```

### Reconstruir las imágenes (después de cambios en el código)
```bash
docker-compose up -d --build
```

### Ver estado de los servicios
```bash
docker-compose ps
```

### Ejecutar comandos dentro de un contenedor
```bash
# Entrar al backend
docker exec -it saveur-backend sh

# Entrar a la base de datos
docker exec -it saveur-database psql -U eventos_user -d eventos_db
```

---

## 🔧 Arquitectura Docker

```
┌─────────────────────────────────────────────────────────┐
│                    Usuario (Navegador)                   │
│                    http://localhost                      │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│  Container: saveur-frontend (Nginx)                      │
│  Puerto: 80                                              │
│  Imagen: nginx:alpine                                    │
│                                                          │
│  • Sirve archivos estáticos de React                    │
│  • Proxy /api → http://backend:8080                     │
└─────────────────────┬───────────────────────────────────┘
                      │
                      │ Red: saveur-network
                      ▼
┌─────────────────────────────────────────────────────────┐
│  Container: saveur-backend (Spring Boot)                 │
│  Puerto: 8080                                            │
│  Imagen: eclipse-temurin:17-jre-alpine                  │
│                                                          │
│  • API REST en /api/*                                   │
│  • JPA + Hibernate                                      │
└─────────────────────┬───────────────────────────────────┘
                      │
                      │ Red: saveur-network
                      ▼
┌─────────────────────────────────────────────────────────┐
│  Container: saveur-database (PostgreSQL)                 │
│  Puerto: 5432                                            │
│  Imagen: postgres:16-alpine                             │
│                                                          │
│  • Base de datos: eventos_db                            │
│  • Usuario: eventos_user                                │
│  • Volumen persistente: postgres_data                   │
└─────────────────────────────────────────────────────────┘
```

---

## 🗄️ Persistencia de Datos

Los datos de PostgreSQL se guardan en un **volumen Docker** llamado `postgres_data`.

Esto significa que:
- ✅ Los datos persisten aunque detengas los contenedores
- ✅ Podés hacer `docker-compose down` y `docker-compose up` sin perder datos
- ⚠️ Solo se borran con `docker-compose down -v`

### Backup de la base de datos

```bash
docker exec saveur-database pg_dump -U eventos_user eventos_db > backup.sql
```

### Restaurar backup

```bash
docker exec -i saveur-database psql -U eventos_user eventos_db < backup.sql
```

---

## 🔐 Variables de Entorno

Las variables se configuran en el archivo `.env` (raíz del proyecto).

| Variable | Valor por defecto | Descripción |
|----------|------------------|-------------|
| `POSTGRES_DB` | eventos_db | Nombre de la base de datos |
| `POSTGRES_USER` | eventos_user | Usuario de PostgreSQL |
| `POSTGRES_PASSWORD` | eventos_password_secure_123 | Contraseña de PostgreSQL |
| `JWT_SECRET` | eventos-secret-key... | Clave secreta para JWT |
| `JWT_EXPIRATION` | 86400000 | Expiración de tokens (24h) |

**⚠️ IMPORTANTE:** Cambia `POSTGRES_PASSWORD` y `JWT_SECRET` en producción.

---

## 🐛 Troubleshooting

### Problema: "Port already in use"

**Solución:** Otro servicio está usando el puerto 80 o 8080.

```bash
# Ver qué está usando el puerto 80
sudo lsof -i :80

# Cambiar el puerto del frontend en docker-compose.yml
ports:
  - "3000:80"  # Ahora accedés en http://localhost:3000
```

### Problema: El backend no conecta a la base de datos

**Solución:** Esperá a que PostgreSQL esté "healthy".

```bash
docker-compose logs database
```

Si ves `database system is ready to accept connections`, está OK.

### Problema: Cambios en el código no se reflejan

**Solución:** Reconstruí las imágenes.

```bash
docker-compose up -d --build
```

### Problema: Error "no space left on device"

**Solución:** Limpiá imágenes viejas de Docker.

```bash
docker system prune -a
```

---

## 📦 Estructura de Archivos Docker

```
saveur-eventos/
├── backend/
│   ├── Dockerfile              # Build del backend
│   └── src/...
├── frontend/
│   ├── Dockerfile              # Build del frontend
│   ├── nginx.conf              # Configuración de Nginx
│   └── src/...
├── docker-compose.yml          # Orquestación de servicios
├── .env                        # Variables de entorno (no subir a Git)
├── .env.example                # Plantilla de variables
├── .dockerignore               # Archivos a ignorar en build
└── README-DOCKER.md            # Esta guía
```

---

## 🚀 Despliegue en Producción

Para producción, considerá:

1. **Usar imágenes multi-stage optimizadas** (ya incluidas en los Dockerfiles)
2. **Cambiar variables de entorno sensibles** (passwords, JWT secret)
3. **Configurar HTTPS** con un reverse proxy (Nginx, Traefik)
4. **Usar Docker Swarm o Kubernetes** para orquestación
5. **Configurar backups automáticos** de la base de datos
6. **Limitar CORS** a tu dominio específico (en `CorsConfig.java`)

---

## 📞 Soporte

Si tenés problemas:

1. Revisá los logs: `docker-compose logs -f`
2. Verificá que Docker Desktop esté corriendo
3. Asegurate de tener suficiente espacio en disco
4. Consultá la documentación oficial de Docker

---

**¡Listo para containerizar tus eventos!** 🎊

Para desarrollo rápido, usá el método tradicional (npm/maven).  
Para despliegue y producción, usá Docker.

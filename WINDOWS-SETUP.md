# 🪟 Guía de Setup en Windows - SAVEUR EVENTOS

Esta guía es específica para usuarios de **Windows** que quieren levantar el sistema con Docker.

---

## 📋 Prerrequisitos

### 1. Instalar Docker Desktop para Windows

Descargá e instalá Docker Desktop:
👉 https://www.docker.com/products/docker-desktop

**Requisitos:**
- Windows 10/11 (64-bit)
- WSL 2 (Windows Subsystem for Linux)
- Virtualización habilitada en BIOS

**Verificar instalación:**
```cmd
docker --version
docker-compose --version
```

---

## 🚀 Opción 1: Scripts Automáticos (Más Fácil)

### Para CMD (Command Prompt)

```cmd
REM 1. Levantar servicios
docker-start.bat

REM 2. Importar datos
docker-import-data.bat
```

### Para PowerShell

```powershell
# 1. Levantar servicios
.\docker-start.bat

# 2. Importar datos (PowerShell)
.\docker-import-data.ps1
```

**⚠️ Nota PowerShell:** Si aparece un error de "execution policy":
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## 🛠️ Opción 2: Comandos Manuales

### Paso 1: Configurar variables de entorno

```cmd
copy .env.example .env
```

Editá el archivo `.env` con Notepad si necesitás cambiar contraseñas.

### Paso 2: Levantar servicios

```cmd
docker-compose up -d
```

### Paso 3: Importar datos

**CMD (Command Prompt):**
```cmd
docker-compose up -d database
timeout /t 10
type database-migration.sql | docker exec -i saveur-database psql -U eventos_user -d eventos_db
docker-compose up -d
```

**PowerShell:**
```powershell
docker-compose up -d database
Start-Sleep -Seconds 10
Get-Content database-migration.sql | docker exec -i saveur-database psql -U eventos_user -d eventos_db
docker-compose up -d
```

### Paso 4: Abrir navegador

Abrí tu navegador en: **http://localhost**

---

## 📁 Archivos Creados para Windows

```
saveur-eventos/
├── docker-start.bat           ← Levantar servicios (CMD)
├── docker-stop.bat            ← Detener servicios (CMD)
├── docker-import-data.bat     ← Importar datos (CMD)
├── docker-import-data.ps1     ← Importar datos (PowerShell)
├── docker-compose.yml         ← Configuración Docker
├── .env.example               ← Plantilla variables de entorno
└── database-migration.sql     ← Datos para importar
```

---

## 🎯 Comandos Útiles para Windows

### CMD (Command Prompt)

```cmd
REM Ver logs
docker-compose logs -f

REM Ver logs de un servicio
docker-compose logs -f backend

REM Reiniciar servicios
docker-compose restart

REM Detener servicios
docker-compose down

REM Reconstruir después de cambios
docker-compose up -d --build

REM Ver estado
docker-compose ps

REM Entrar a la base de datos
docker exec -it saveur-database psql -U eventos_user -d eventos_db
```

### PowerShell

```powershell
# Ver logs
docker-compose logs -f

# Ver logs de un servicio
docker-compose logs -f backend

# Reiniciar servicios
docker-compose restart

# Detener servicios
docker-compose down

# Reconstruir después de cambios
docker-compose up -d --build

# Ver estado
docker-compose ps

# Entrar a la base de datos
docker exec -it saveur-database psql -U eventos_user -d eventos_db
```

---

## 🔍 Verificar que Todo Funciona

### 1. Verificar contenedores corriendo

```cmd
docker ps
```

Deberías ver 3 contenedores:
- `saveur-database` (PostgreSQL)
- `saveur-backend` (Spring Boot)
- `saveur-frontend` (Nginx)

### 2. Verificar logs sin errores

```cmd
docker-compose logs backend
```

Buscar línea como: `Started EventosApplication in X seconds`

### 3. Abrir la aplicación

Abrí http://localhost en tu navegador

---

## 🐛 Troubleshooting en Windows

### Error: "Docker daemon is not running"

**Solución:**
1. Abrí Docker Desktop
2. Esperá a que inicie completamente (ícono en la bandeja del sistema)
3. Intentá de nuevo

### Error: "Port 80 is already in use"

**Solución:** Otro programa está usando el puerto 80 (probablemente IIS o Skype).

**Opción A: Detener el servicio que usa puerto 80**
```cmd
net stop http
```

**Opción B: Cambiar el puerto del frontend**

Editá `docker-compose.yml`:
```yaml
frontend:
  ports:
    - "3000:80"  # Ahora usa http://localhost:3000
```

### Error: "WSL 2 installation is incomplete"

**Solución:**
1. Instalá WSL 2: https://aka.ms/wsl2kernel
2. Reiniciá tu PC
3. Abrí Docker Desktop

### Error: "The system cannot find the file specified"

**Solución:** Asegurate de estar en el directorio correcto.

```cmd
cd ruta\a\saveur-eventos
dir database-migration.sql
```

### Error al ejecutar script PowerShell

**Solución:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Los cambios en el código no se reflejan

**Solución:**
```cmd
docker-compose up -d --build
```

---

## 🗂️ Rutas de Archivos en Windows

### Volumen de PostgreSQL

```
C:\ProgramData\Docker\volumes\saveur-eventos_postgres_data\_data
```

### Logs de Docker Desktop

```
%APPDATA%\Docker\log
```

---

## 📊 Comparación CMD vs PowerShell

| Característica | CMD | PowerShell |
|---------------|-----|------------|
| **Sintaxis** | Más simple | Más moderna |
| **Colores** | Básicos | Soporte completo |
| **Pipes** | Limitado | Completo |
| **Scripts** | .bat | .ps1 |
| **Recomendado para** | Usuarios básicos | Usuarios avanzados |

**💡 Recomendación:** Usá CMD (.bat) si sos principiante, PowerShell (.ps1) si tenés experiencia.

---

## ✅ Checklist de Setup Exitoso

- [ ] Docker Desktop instalado y corriendo
- [ ] Archivo `.env` creado
- [ ] `docker-compose up -d` ejecutado sin errores
- [ ] 3 contenedores corriendo (`docker ps`)
- [ ] Datos importados con `docker-import-data.bat` o `.ps1`
- [ ] http://localhost abre la aplicación
- [ ] Login funciona con un usuario existente

---

## 🎓 Video Tutorial (Si Necesitás Ayuda Visual)

1. **Instalar Docker en Windows:**
   https://www.youtube.com/results?search_query=install+docker+desktop+windows

2. **Usar Docker Compose:**
   https://www.youtube.com/results?search_query=docker+compose+tutorial

---

## 🔐 Notas de Seguridad

### Firewall de Windows

Docker Desktop puede pedir permisos de firewall. **Permitir** para que funcione correctamente.

### Antivirus

Algunos antivirus bloquean Docker. Si tenés problemas, agregá una excepción para:
- `C:\Program Files\Docker`
- `%APPDATA%\Docker`

---

## 🚀 Resumen Rápido para Windows

### Setup Inicial (Una sola vez)

```cmd
REM 1. Configurar entorno
copy .env.example .env

REM 2. Levantar servicios
docker-start.bat

REM 3. Importar datos
docker-import-data.bat

REM 4. Abrir navegador
start http://localhost
```

### Uso Diario

```cmd
REM Levantar
docker-start.bat

REM Trabajar...

REM Detener
docker-stop.bat
```

---

**¡Listo para trabajar en Windows!** 🪟🎉

Para más detalles técnicos, consultá [README-DOCKER.md](README-DOCKER.md)

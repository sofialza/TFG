# 🎉 SAVEUR EVENTOS - Sistema de Gestión de Eventos

Sistema web para gestionar eventos, controlar inventario de insumos, calcular proyecciones automáticas de consumo y generar alertas de stock bajo.

---

## ⚡ VERSIÓN SUPER RÁPIDA (SOLO PARA REPLIT)

Si estás viendo esto en **Replit**, es MUY SIMPLE:

1. **Hacé click en el botón RUN** (arriba) → Esto inicia automáticamente el backend y el frontend
2. **Esperá 15-30 segundos** hasta que veas la pantalla de login en el navegador del lado derecho
3. **Ingresá con cualquier nombre** y elegí un rol (Administrador, Encargada de Cocina, u Organizador de Eventos)
4. **¡Listo!** Ya podés usar el sistema

**Nota**: Si algo no se ve bien, probá hacer "Hard Refresh" en el navegador presionando `Ctrl + Shift + R` (Windows/Linux) o `Cmd + Shift + R` (Mac).

---

## 🚀 GUÍA COMPLETA - PASO A PASO (PARA TU COMPUTADORA)

### ✅ Paso 1: Verificar que tienes lo necesario

Si estás en **Replit**, ya tienes todo listo. Si estás en tu computadora, necesitas:
- Java 17 o superior instalado
- Node.js 20 o superior instalado
- PostgreSQL instalado y corriendo

### ✅ Paso 2: Abrir dos terminales

Necesitás **DOS ventanas de terminal** abiertas (una para el backend, otra para el frontend).

### ✅ Paso 3: Iniciar el BACKEND (Servidor Java)

En la **primera terminal**, escribí estos comandos uno por uno:

```bash
cd backend
mvn spring-boot:run
```

Esperá a ver el mensaje: `Started EventosApplication in X.XXX seconds`

Esto significa que el backend está funcionando en `http://localhost:8080`

### ✅ Paso 4: Iniciar el FRONTEND (Interfaz Web)

En la **segunda terminal**, escribí estos comandos uno por uno:

```bash
cd frontend
npm install
npm run dev
```

Esperá a ver el mensaje: `Local: http://localhost:5000/`

Esto significa que el frontend está funcionando.

### ✅ Paso 5: Abrir el sistema en tu navegador

1. Abrí tu navegador (Chrome, Firefox, etc.)
2. Andá a: **http://localhost:5000**
3. ¡Listo! Vas a ver la pantalla de login del sistema

### ✅ Paso 6: Ingresar al sistema

En la pantalla de login:
1. **Usuario**: Escribí cualquier nombre (ej: "Juan")
2. **Rol**: Elegí uno de estos:
   - **Administrador** → Si querés ver todo el sistema
   - **Encargada de Cocina** → Si querés gestionar stock e insumos
   - **Organizador de Eventos** → Si querés crear y gestionar eventos
3. Hacé click en **Ingresar**

### 🎯 ¡Ya está! Ahora podés usar el sistema

---

## 🛑 ¿Algo no funciona?

### El backend no arranca
- Verificá que tengas Java 17 o superior: `java -version`
- Asegurate de estar en la carpeta `backend`
- Revisá que el puerto 8080 no esté ocupado

### El frontend no arranca
- Verificá que tengas Node.js: `node -version`
- Asegurate de estar en la carpeta `frontend`
- Probá ejecutar `npm install` de nuevo

### No se conecta a la base de datos
- Si estás en Replit, la base de datos ya está configurada
- Si estás en tu PC, verificá que PostgreSQL esté corriendo

---

## 📋 Descripción Completa del Sistema

Este sistema permite administrar eventos de forma integral, desde la planificación hasta el control de insumos necesarios. Incluye cálculo automático de consumo proyectado según la cantidad de asistentes y un sistema de alertas que avisa cuando el stock actual es insuficiente para cubrir los eventos programados.

## 🏗️ Arquitectura

El proyecto implementa una **arquitectura en 4 capas** siguiendo el patrón MVC:

- **Capa Cliente**: Navegador web del usuario
- **Capa Frontend**: React con Vite (puerto 5000)
- **Capa de Lógica de Negocio**: Java Spring Boot con patrón MVC (puerto 8080)
- **Capa de Datos**: PostgreSQL (Replit integrado)

## 🛠️ Tecnologías Utilizadas

### Backend
- Java 17
- Spring Boot 3.1.5
- Spring Data JPA / Hibernate
- PostgreSQL
- Maven

### Frontend
- React 19.1.1
- React Router DOM 7.1.1
- Vite 6.0.3
- Axios para consumo de API REST

## 🚀 Instalación y Ejecución

### 🐳 Opción 1: Docker (Recomendado para Producción)

Si tenés Docker instalado, podés levantar todo el sistema con un solo comando:

```bash
docker-compose up -d
```

Abrí tu navegador en `http://localhost`

📖 **[Ver guía completa de Docker](README-DOCKER.md)**

---

### 💻 Opción 2: Ejecución Manual (Desarrollo)

#### Prerrequisitos
- Java 17 o superior
- Node.js 20 o superior
- PostgreSQL (ya configurado en Replit)

#### Backend (Puerto 8080)

```bash
cd backend
mvn spring-boot:run
```

El backend estará disponible en `http://localhost:8080`

#### Frontend (Puerto 5000)

```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible en `http://localhost:5000`

## 👥 Roles de Usuario

El sistema cuenta con **3 roles diferenciados**, cada uno con su propio dashboard:

### 1️⃣ Administrador
- **Responsabilidades**: Decisiones estratégicas, contratación de proveedores
- **Acceso completo** a todas las funcionalidades del sistema
- Dashboard con estadísticas generales y gestión integral

### 2️⃣ Encargada de Cocina
- **Responsabilidades**: Preparación de pedidos, control de insumos
- Dashboard enfocado en **alertas de stock** y gestión de inventario
- Vista prioritaria de insumos faltantes y órdenes de compra

### 3️⃣ Organizador de Eventos
- **Responsabilidades**: Armado de eventos, contacto con clientes
- Dashboard con **calendario de eventos** y gestión de menús
- Vista de eventos próximos y disponibilidad de recursos

## 📱 Funcionalidades Principales

### 🎊 Gestión de Eventos
- Crear, listar y eliminar eventos
- Asignar menú a cada evento
- Especificar fecha, lugar y cantidad de asistentes
- Cliente asociado a cada evento

### 🍽️ Gestión de Menús
- Crear menús personalizados
- Definir primer plato, segundo plato y torta
- Asignar menús a eventos
- Listado completo de menús disponibles

### 📦 Control de Insumos
- Registrar insumos con stock actual
- Definir unidades de medida
- **Sistema de alertas automático** cuando stock < consumo proyectado
- Indicadores visuales de estado de stock

### 🛒 Órdenes de Compra
- Crear órdenes para reabastecer insumos
- Estados: Pendiente / Aprobada / Rechazada
- Gestión de proveedores
- Historial de compras

### 📊 Proyección Automática de Consumo
El sistema calcula automáticamente el consumo proyectado de cada insumo:

```
Consumo Proyectado = Cantidad de Asistentes × Cantidad por Persona
```

Si `Stock Actual < Consumo Proyectado` → **Se genera una alerta automática**

### 🚨 Sistema de Alertas Inteligente
- Detecta automáticamente insumos con stock insuficiente
- Calcula el déficit exacto: `Déficit = Consumo Proyectado - Stock Actual`
- Muestra alertas prioritarias en el dashboard de Encargada de Cocina
- Indicadores visuales con colores (verde/amarillo/rojo)

## 🗄️ Base de Datos

El sistema utiliza **PostgreSQL** con las siguientes tablas (creadas automáticamente por Hibernate):

- `usuario` - Usuarios del sistema con roles
- `evento` - Eventos programados
- `menu` - Menús disponibles
- `menu_insumo` - Relación menú-insumo (muchos a muchos)
- `insumo` - Insumos de cocina
- `extra` - Extras opcionales para eventos
- `evento_extra` - Relación evento-extra
- `orden_compra` - Órdenes de compra
- `orden_compra_detalle` - Detalle de cada orden
- `proveedor` - Proveedores
- `prov_insumo` - Relación proveedor-insumo

### Diagrama de Relaciones

```
Evento (1) ─→ (N) EventoExtra ←─ (N) Extra
   ↓
Menu (1) ─→ (N) MenuInsumo ←─ (N) Insumo
                                    ↓
OrdenCompra (1) ─→ (N) OrdenCompraDetalle → Insumo
   ↓
Proveedor (1) ─→ (N) ProvInsumo ←─ (N) Insumo
```

## 🔐 Autenticación

El sistema cuenta con autenticación basada en roles:

1. **Pantalla de Login**: Usuario selecciona su rol
2. **Protección de rutas**: Solo usuarios autenticados pueden acceder
3. **Dashboard personalizado**: Cada rol ve su propio dashboard
4. **Sesión persistente**: El usuario permanece logueado (localStorage)

### Usuarios de Prueba

Para probar el sistema, podés ingresar con cualquier nombre de usuario y seleccionar uno de estos roles:

- **Administrador** → Vista completa del sistema
- **Encargada de Cocina** → Foco en alertas e insumos
- **Organizador de Eventos** → Foco en eventos y menús

## 🎨 Capturas de Pantalla

### Login
Pantalla de ingreso con selección de rol

### Dashboard Administrador
Vista general con estadísticas y acceso a todas las secciones

### Dashboard Encargada de Cocina
Alertas de stock bajo prioritarias y gestión de insumos

### Dashboard Organizador de Eventos
Calendario de eventos próximos y gestión de menús

## 📡 API REST

El backend expone los siguientes endpoints:

### Eventos
- `GET /api/eventos` - Listar todos los eventos
- `POST /api/eventos` - Crear evento
- `GET /api/eventos/{id}` - Obtener evento por ID
- `PUT /api/eventos/{id}` - Actualizar evento
- `DELETE /api/eventos/{id}` - Eliminar evento
- `GET /api/eventos/{id}/proyeccion-consumo` - Calcular proyección

### Menús
- `GET /api/menus` - Listar todos los menús
- `POST /api/menus` - Crear menú
- `GET /api/menus/{id}` - Obtener menú por ID
- `PUT /api/menus/{id}` - Actualizar menú
- `DELETE /api/menus/{id}` - Eliminar menú

### Insumos
- `GET /api/insumos` - Listar todos los insumos
- `POST /api/insumos` - Crear insumo
- `GET /api/insumos/{id}` - Obtener insumo por ID
- `PUT /api/insumos/{id}` - Actualizar insumo
- `DELETE /api/insumos/{id}` - Eliminar insumo
- `GET /api/insumos/alertas-stock-bajo` - Obtener alertas

### Órdenes de Compra
- `GET /api/ordenes-compra` - Listar todas las órdenes
- `POST /api/ordenes-compra` - Crear orden
- `GET /api/ordenes-compra/{id}` - Obtener orden por ID
- `PUT /api/ordenes-compra/{id}` - Actualizar orden
- `DELETE /api/ordenes-compra/{id}` - Eliminar orden
- `GET /api/ordenes-compra/pendientes` - Órdenes pendientes

## 🔧 Configuración

### Backend (`backend/src/main/resources/application.properties`)

```properties
spring.datasource.url=${DATABASE_URL}
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### Frontend (`frontend/vite.config.js`)

```javascript
export default defineConfig({
  server: {
    port: 5000,
    host: '0.0.0.0'
  }
})
```

## 📂 Estructura del Proyecto

```
/
├── backend/
│   └── src/main/java/com/eventos/
│       ├── model/           # 11 entidades JPA
│       ├── repository/      # 8 repositorios
│       ├── service/         # Lógica de negocio
│       ├── controller/      # 8 REST controllers
│       └── config/          # Configuración (Security, CORS)
├── frontend/
│   └── src/
│       ├── components/      # Navbar
│       ├── context/         # AuthContext
│       ├── pages/           # Vistas (Login, Dashboards, CRUD)
│       ├── services/        # API service con axios
│       └── App.jsx          # Router principal
└── README.md
```

## 🎯 Casos de Uso Principales

### 1. Planificar un Evento
1. El **Organizador** ingresa al sistema
2. Va a "Eventos" → "Crear Nuevo Evento"
3. Completa: nombre del cliente, fecha, lugar, cantidad de asistentes
4. Selecciona un menú de la lista
5. El sistema calcula automáticamente el consumo proyectado

### 2. Verificar Stock
1. La **Encargada de Cocina** ve alertas en su dashboard
2. Identifica insumos con stock insuficiente
3. Revisa el déficit calculado automáticamente
4. Crea una orden de compra para reabastecer

### 3. Aprobar Compras
1. El **Administrador** revisa órdenes pendientes
2. Verifica proveedores y montos
3. Aprueba o rechaza las órdenes
4. El stock se actualiza al recibir la mercadería

## 🚧 Futuras Mejoras

- [ ] Autenticación JWT completa con backend
- [ ] Gestión de proveedores con calificaciones
- [ ] Reportes en PDF y Excel
- [ ] Notificaciones push para alertas críticas
- [ ] Dashboard con gráficos estadísticos
- [ ] Gestión de extras personalizables por evento
- [ ] Integración con sistema de facturación
- [ ] App móvil nativa

## 🤝 Contribuir

Este es un proyecto educativo. Si querés contribuir:

1. Fork del repositorio
2. Creá una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrí un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👨‍💻 Autor

Desarrollado como proyecto de gestión de eventos con control automatizado de inventario.

## 📞 Soporte

Si tenés alguna duda o problema:
- Revisá la documentación
- Verificá que ambos servidores (backend y frontend) estén corriendo
- Asegurate de tener las variables de entorno configuradas correctamente

---

**¡Listo para gestionar tus eventos!** 🎊

Para comenzar:
1. Iniciá el backend: `cd backend && mvn spring-boot:run`
2. Iniciá el frontend: `cd frontend && npm run dev`
3. Abrí tu navegador en `http://localhost:5000`
4. Ingresá con cualquier usuario y seleccioná tu rol

¡Que lo disfrutes! 🚀
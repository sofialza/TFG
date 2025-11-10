# Sistema de Gestión de Eventos con Control de Insumos

## Descripción del Proyecto
Sistema web full-stack para gestionar eventos, controlar inventario de insumos, calcular proyecciones automáticas de consumo y generar alertas de stock bajo.

## Arquitectura
- **Frontend**: React con Vite (puerto 5000)
- **Backend**: Java Spring Boot  (puerto 8080)
- **Base de Datos**: PostgreSQL (Replit integrado)
- **Patrón**: MVC con arquitectura en 4 capas

## Tecnologías
- React 19.1.1
- Spring Boot 3.1.5
- PostgreSQL
- JPA/Hibernate
- Spring Security
- Maven

## Estructura del Proyecto

```
/
├── backend/             # Backend Java Spring Boot
│   └── src/main/java/com/eventos/
│       ├── model/      # Entidades JPA (11 modelos)
│       ├── repository/ # Repositorios JPA
│       ├── service/    # Lógica de negocio
│       ├── controller/ # REST Controllers
│       └── config/     # Configuración (Security, CORS)
├── frontend/           # Frontend React con Vite
│   └── src/
└── replit.md          # Este archivo
```

## Funcionalidades Implementadas

### Backend Completo ✅
1. **Entidades JPA** (11 tablas):
   - Usuario (autenticación con 3 roles)
   - Evento, Menu, MenuInsumo
   - Insumo, Extra, EventoExtra
   - OrdenCompra, OrdenCompraDetalle
   - ProvInsumo, Proveedor

2. **Lógica de Negocio**:
   - Proyección automática de consumo: `cantidadAsistentes × cantidadPorPersona`
   - Sistema de alertas cuando `stockActual < consumoProyectado`
   - Gestión completa de órdenes de compra
   - Reportes de compras pendientes e histórico

3. **API REST Endpoints**:
   - `/api/eventos` - CRUD de eventos
   - `/api/eventos/{id}/proyeccion-consumo` - Calcular proyección
   - `/api/menus` - CRUD de menús
   - `/api/insumos` - CRUD de insumos
   - `/api/insumos/alertas-stock-bajo` - Obtener alertas
   - `/api/ordenes-compra` - CRUD de órdenes
   - `/api/ordenes-compra/pendientes` - Compras pendientes

### Frontend React Completo ✅
1. **Dashboard Principal**:
   - Estadísticas en tiempo real (eventos, insumos, alertas)
   - Acceso rápido a todas las secciones del sistema
   
2. **Gestión de Eventos (Reservas)**:
   - Listar todos los eventos con detalles (fecha, asistentes, menú)
   - Crear nuevos eventos con selección de menú (permisos: ADMINISTRADOR, ORGANIZADOR_EVENTOS)
   - Modificar y cancelar eventos (permisos: ADMINISTRADOR, ORGANIZADOR_EVENTOS)
   - Búsqueda integrada por nombre de cliente y/o fecha
   - Vista de solo lectura para ENCARGADA_COCINA (botones deshabilitados con tooltips)
   
3. **Gestión de Menús** (Solo visualización - menús precargados):
   - Los menús están precargados en la base de datos
   - No se permite CRUD de menús en el MVP
   - Se seleccionan de los disponibles al crear eventos
   
4. **Gestión de Insumos y Stock**:
   - Listar insumos con indicadores de stock
   - Actualizar stock actual (permisos: ADMINISTRADOR, ENCARGADA_COCINA)
   - Sistema de alertas visuales para stock bajo
   - Proyección de consumo por evento
   - **Exportar proyección a CSV** ✅
   - Controles deshabilitados con tooltips para roles sin permisos
   
5. **Gestión de Órdenes de Compra**:
   - Listar órdenes con estado (pendiente/aprobada/rechazada)
   - Crear nuevas órdenes
   - Eliminar órdenes
   
6. **Navegación**:
   - Barra de navegación con acceso a todas las secciones
   - Interfaz limpia sin marcas de Replit

7. **Sistema de Autenticación** ✅:
   - Vista de login con selección de rol
   - AuthContext para gestión de sesiones
   - Protección de rutas (solo usuarios autenticados)
   - Sesión persistente en localStorage
   - Logout desde navbar

8. **Dashboards por Rol** ✅:
   - Dashboard Administrador: Estadísticas generales y gestión completa
   - Dashboard Encargada de Cocina: Alertas de stock y control de insumos
   - Dashboard Organizador de Eventos: Calendario de eventos y menús

## Roles de Usuario y Permisos
1. **Administrador**: 
   - Acceso completo a todas las funcionalidades
   - Eventos: CRUD completo
   - Stock: Actualizar y visualizar proyecciones
   - Reservas: Modificar y cancelar
   - Reportes: Ver todos
   
2. **Encargada de Cocina**: 
   - Stock: Actualizar stock y visualizar proyecciones (CRUD completo)
   - Reservas: Solo visualización (no puede modificar/cancelar)
   - Reportes: Ver reportes de stock y compras
   - Eventos: Solo visualización en dashboard
   
3. **Organizador de Eventos**: 
   - Eventos: CRUD completo (crear, modificar, cancelar)
   - Reservas: Modificar y cancelar eventos
   - Stock: Solo visualización de proyecciones (no puede actualizar stock)
   - Reportes: Ver reportes de eventos

## Base de Datos
PostgreSQL con 11 tablas creadas automáticamente por Hibernate:
- Todas las foreign keys y constraints configuradas
- Índices automáticos en primary keys
- Enum types para roles y estados

## Comandos

### Backend
```bash
cd backend && mvn spring-boot:run
```

### Frontend
```bash
cd frontend && npm run dev
```

## Estado Actual - Sistema Completo ✅
- ✅ Backend Java completamente funcional con @JsonIgnore en relaciones bidireccionales
- ✅ Base de datos PostgreSQL configurada con datos de prueba
- ✅ API REST completa con 8 controllers
- ✅ Proxy de Vite configurado para conectar frontend con backend
- ✅ Dashboard Principal "SAVEUR EVENTOS" unificado para todos los roles
- ✅ Sistema de permisos visual: botones grises con cursor:not-allowed y tooltips informativos
- ✅ Funcionalidad de logout implementada con información del usuario
- ✅ 6 vistas principales: DashboardPrincipal, CrearEvento, ModificarEvento, Reservas, ManejarStock, Reportes
- ✅ Sistema de alertas de stock bajo funcionando
- ✅ Proyección de consumo automática operativa
- ✅ Sistema de autenticación con login y protección de rutas
- ✅ Componentes antiguos eliminados (DashboardAdministrador, DashboardEncargadaCocina, etc.)
- ✅ Ambos workflows (frontend/backend) corriendo sin errores de serialización
- ✅ Control de permisos granular por rol en todas las vistas
- ✅ Búsqueda de eventos simplificada (integrada en tabla, sin tabs separadas)
- ✅ Exportación CSV de proyección de consumo
- ✅ Controles visuales (botones grises + tooltips) para acciones no permitidas por rol

## Próximos Pasos (Opcional)
1. **Implementar Extras**: Agregar checkboxes de extras en CrearEvento y ModificarEvento
2. **Autenticación Backend**: Implementar JWT con backend (actualmente es solo frontend)
3. **Testing**: Testing exhaustivo y optimización
4. **Deployment**: Publicar a producción
5. **Reportes Avanzados**: Exportar reportes en PDF/Excel

## Limitaciones de Seguridad (Solo MVP)
⚠️ **IMPORTANTE**: La autenticación actual es **solo frontend** (localStorage):
- Los roles y permisos se gestionan en el cliente
- No hay validación de permisos en el backend
- Para producción, se requiere implementar JWT con Spring Security
- La API REST actual es pública (sin autenticación)

## Notas Técnicas
- El proyecto NO usa MySQL porque en Replit, PostgreSQL está integrado nativamente
- PostgreSQL es compatible con MySQL para la mayoría de las consultas SQL
- No hay marcas de Replit en la aplicación (completamente personalizada)
- Frontend configurado para puerto 5000 (único puerto expuesto para webview)
- Backend en localhost:8080 (accesible desde frontend)

## Solución de Serialización JSON Implementada
Para prevenir recursión infinita en relaciones bidireccionales JPA:
- **Colecciones padres (OneToMany)**: Sin @JsonIgnore para incluir datos en respuestas API
- **Referencias hijas (ManyToOne)**: Con @JsonIgnore para romper ciclos de recursión
- Ejemplos:
  - `Evento.eventoExtras` serializa → `EventoExtra.evento` tiene @JsonIgnore
  - `Menu.menuInsumos` serializa → `MenuInsumo.menu` y `MenuInsumo.insumo` tienen @JsonIgnore
  - `OrdenCompra.detalles` serializa → `OrdenCompraDetalle.ordenCompra` tiene @JsonIgnore

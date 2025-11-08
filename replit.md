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
   
2. **Gestión de Eventos**:
   - Listar todos los eventos con detalles (fecha, asistentes, menú)
   - Crear nuevos eventos con selección de menú
   - Eliminar eventos
   
3. **Gestión de Menús**:
   - Listar todos los menús disponibles
   - Crear nuevos menús (primer plato, segundo plato, torta)
   - Eliminar menús
   
4. **Gestión de Insumos**:
   - Listar insumos con indicadores de stock
   - Crear nuevos insumos (nombre, stock actual, unidad de medida)
   - Eliminar insumos
   - Sistema de alertas visuales para stock bajo
   
5. **Gestión de Órdenes de Compra**:
   - Listar órdenes con estado (pendiente/aprobada/rechazada)
   - Crear nuevas órdenes
   - Eliminar órdenes
   
6. **Navegación**:
   - Barra de navegación con acceso a todas las secciones
   - Interfaz limpia sin marcas de Replit

### Características Opcionales (Futuro)
- ⏳ Vista de login con autenticación JWT
- ⏳ Dashboards diferenciados por rol (Administrador, Encargada de Cocina, Organizador de Eventos)

## Roles de Usuario
1. **Administrador**: Decisiones estratégicas, contratación proveedores
2. **Encargada de Cocina**: Preparación pedidos, control insumos
3. **Organizador de Eventos**: Armado eventos, contacto clientes

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

## Estado Actual (MVP Completo)
- ✅ Backend Java completamente funcional
- ✅ Base de datos PostgreSQL configurada
- ✅ API REST completa con 8 controllers
- ✅ Frontend React con todas las funcionalidades principales
- ✅ Sistema de alertas de stock bajo funcionando
- ✅ Proyección de consumo automática operativa
- ✅ CRUD completo para eventos, menús, insumos y órdenes
- ✅ Ambos workflows (frontend/backend) corriendo sin errores

## Próximos Pasos (Opcional)
1. Implementar autenticación JWT con vista de login
2. Crear dashboards diferenciados por rol de usuario
3. Testing exhaustivo y optimización
4. Deployment a producción

## Notas Técnicas
- El proyecto NO usa MySQL porque en Replit, PostgreSQL está integrado nativamente
- PostgreSQL es compatible con MySQL para la mayoría de las consultas SQL
- No hay marcas de Replit en la aplicación (completamente personalizada)
- Frontend configurado para puerto 5000 (único puerto expuesto para webview)
- Backend en localhost:8080 (accesible desde frontend)

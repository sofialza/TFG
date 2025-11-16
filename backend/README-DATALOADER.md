# 📦 DataLoader - Inicialización Automática de Datos

## 🎯 Propósito

El `DataLoader` es un componente de Spring Boot que inicializa automáticamente los datos maestros del sistema **solo en el primer arranque** (cuando la base de datos está vacía).

## 🚀 ¿Cómo Funciona?

### Verificación Automática

Al iniciar la aplicación, el DataLoader:

1. **Verifica** si la tabla `extra` tiene registros
2. **Si está vacía** → Carga todos los datos maestros
3. **Si tiene datos** → No hace nada (para no duplicar)

### Datos que se Cargan

El DataLoader inicializa las siguientes tablas:

| Tabla | Cantidad | Descripción |
|-------|----------|-------------|
| **extras** | 5 | Servicios adicionales (DJ, torta, decoración, etc.) |
| **proveedores** | 5 | Proveedores de insumos |
| **insumos** | 15 | Ingredientes y productos (carne, pollo, arroz, etc.) |
| **menus** | 5 | Menús predefinidos (Clásico, Gourmet, Vegetariano, etc.) |
| **menu_insumo** | 42 | Relaciones menú-insumo (cantidades por persona) |
| **prov_insumo** | 15 | Relaciones proveedor-insumo (precios) |

## 📊 Datos Cargados

### 1. Extras (5 registros)

```
- Torta personalizada ($45,000)
- DJ ($120,000)
- Decoración premium ($95,000)
- Souvenirs ($30,000)
- Kit Carioca ($18,000)
```

### 2. Proveedores (5 registros)

```
- Proveedor Central
- Distribuidora Norte
- Almacén del Sur
- Carnes Premium
- Verduras Frescas
```

### 3. Insumos (15 registros)

```
Carnes: Carne vacuna, Pollo
Verduras: Papa, Tomate, Lechuga
Cereales: Arroz, Harina
Lácteos: Leche, Crema, Dulce de leche
Otros: Aceite, Azúcar, Huevos
Bebidas: Vino tinto, Gaseosa
```

### 4. Menús (5 registros)

#### Menú Clásico
- Primer plato: Ensalada mixta
- Segundo plato: Asado con guarnición
- Torta: Torta de dulce de leche
- **Insumos**: Carne (0.25kg/p), Papa (0.15kg/p), Tomate, Lechuga, etc.

#### Menú Gourmet
- Primer plato: Carpaccio de res
- Segundo plato: Suprema rellena con salsa champignones
- Torta: Marquise de chocolate
- **Insumos**: Carne (0.2kg/p), Pollo (0.2kg/p), Crema, etc.

#### Menú Vegetariano
- Primer plato: Ensalada caprese
- Segundo plato: Tarta de verduras con arroz
- Torta: Lemon pie
- **Insumos**: Papa (0.2kg/p), Tomate, Lechuga, Arroz, Huevos, etc.

#### Menú Infantil
- Primer plato: Palitos de queso
- Segundo plato: Milanesas con papas fritas
- Torta: Torta de vainilla
- **Insumos**: Pollo (0.15kg/p), Papa (0.2kg/p), Harina, etc.

#### Menú Ejecutivo
- Primer plato: Tabla de fiambres
- Segundo plato: Pollo al horno con papas
- Torta: Tiramisú
- **Insumos**: Pollo (0.25kg/p), Papa (0.15kg/p), Huevos, etc.

## 🔧 Ubicación del Código

```
backend/src/main/java/com/eventos/config/DataLoader.java
```

## 📝 Logs al Iniciar

Cuando el DataLoader se ejecuta, verás estos logs:

```
🎯 Inicializando datos maestros...
📦 Cargando Extras...
✅ Extras cargados: 5
🏢 Cargando Proveedores...
✅ Proveedores cargados: 5
🥘 Cargando Insumos...
✅ Insumos cargados: 15
📋 Cargando Menús...
✅ Menús cargados: 5
🔗 Cargando relaciones Menú-Insumo...
✅ Relaciones Menú-Insumo cargadas: 42
🔗 Cargando relaciones Proveedor-Insumo...
✅ Relaciones Proveedor-Insumo cargadas: 15
🎉 ¡Datos maestros inicializados correctamente!
```

Si los datos ya existen:

```
ℹ️  Datos maestros ya existen, omitiendo inicialización.
```

## ⚙️ Cuándo se Ejecuta

El DataLoader se ejecuta:

✅ **Al iniciar la aplicación** (con `mvn spring-boot:run` o en Docker)
✅ **Solo si la tabla `extra` está vacía**
❌ **NO se ejecuta** si ya hay datos (no duplica)

## 🐳 Docker

Cuando levantás la aplicación con Docker por primera vez:

```bash
docker-compose up -d
```

El DataLoader se ejecuta automáticamente y carga todos los datos.

**Importante:** Si ya importaste datos con `database-migration.sql`, el DataLoader **NO cargará nada** porque detecta que ya existen datos.

## 🔄 Regenerar Datos

Si querés que el DataLoader vuelva a ejecutarse:

### Opción 1: Borrar todos los datos

```sql
TRUNCATE TABLE evento_extra, evento, orden_compra_detalle, orden_compra, 
             menu_insumo, prov_insumo, extra, menu, insumo, proveedor, usuario 
             RESTART IDENTITY CASCADE;
```

### Opción 2: En Docker, recrear la base de datos

```bash
docker-compose down -v  # ⚠️ Borra TODO
docker-compose up -d    # Inicia limpio y carga datos
```

## 🎯 Ventajas

✅ **Setup automático**: No necesitás cargar datos manualmente
✅ **Idempotente**: No duplica datos si ya existen
✅ **Consistente**: Siempre carga los mismos datos base
✅ **Fácil de modificar**: Solo editás `DataLoader.java`
✅ **Logs claros**: Sabés exactamente qué se cargó

## 🛠️ Modificar Datos Iniciales

Si querés cambiar los datos que se cargan:

1. Abrí `backend/src/main/java/com/eventos/config/DataLoader.java`
2. Modificá los objetos que se crean (nombres, precios, cantidades)
3. Guardá y reiniciá la aplicación
4. Si ya tenés datos, borrá la base de datos primero

## 📌 Notas Importantes

- El DataLoader usa **JPA/Hibernate** para insertar datos (no SQL directo)
- Los datos cargados son los mismos que estaban en la base de datos de Replit
- Es seguro ejecutarlo múltiples veces (no duplica)
- Se ejecuta **después** de que Hibernate crea las tablas

---

**¡Los datos maestros se cargan automáticamente al primer arranque!** 🎉

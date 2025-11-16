package com.eventos.config;

import com.eventos.model.*;
import com.eventos.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;

/**
 * DataLoader - Inicializa datos maestros en el primer arranque
 * Solo carga datos si las tablas están vacías (fresh database)
 */
@Configuration
public class DataLoader {

    private static final Logger logger = LoggerFactory.getLogger(DataLoader.class);

    @Bean
    CommandLineRunner initDatabase(
            ExtraRepository extraRepo,
            ProveedorRepository proveedorRepo,
            InsumoRepository insumoRepo,
            MenuRepository menuRepo,
            MenuInsumoRepository menuInsumoRepo,
            ProvInsumoRepository provInsumoRepo
    ) {
        return args -> {
            // Solo cargar datos si las tablas están vacías
            if (extraRepo.count() == 0) {
                logger.info("🎯 Inicializando datos maestros...");
                
                // ===============================================
                // 1. EXTRAS
                // ===============================================
                logger.info("📦 Cargando Extras...");
                Extra extra1 = new Extra();
                extra1.setNombre("Torta personalizada");
                extra1.setDescripcion("Diseño temático");
                extra1.setPrecio(45000.0);
                extraRepo.save(extra1);

                Extra extra2 = new Extra();
                extra2.setNombre("DJ");
                extra2.setDescripcion("Servicio musical 5 horas");
                extra2.setPrecio(120000.0);
                extraRepo.save(extra2);

                Extra extra3 = new Extra();
                extra3.setNombre("Decoración premium");
                extra3.setDescripcion("Ambientación completa");
                extra3.setPrecio(95000.0);
                extraRepo.save(extra3);

                Extra extra4 = new Extra();
                extra4.setNombre("Souvenirs");
                extra4.setDescripcion("Recuerdos personalizados");
                extra4.setPrecio(30000.0);
                extraRepo.save(extra4);

                Extra extra5 = new Extra();
                extra5.setNombre("Kit Carioca");
                extra5.setDescripcion("Cotillón luminoso");
                extra5.setPrecio(18000.0);
                extraRepo.save(extra5);
                
                logger.info("✅ Extras cargados: {}", extraRepo.count());

                // ===============================================
                // 2. PROVEEDORES
                // ===============================================
                logger.info("🏢 Cargando Proveedores...");
                Proveedor prov1 = new Proveedor();
                prov1.setNombre("Proveedor Central");
                prov1.setContacto("central@proveedores.com");
                proveedorRepo.save(prov1);

                Proveedor prov2 = new Proveedor();
                prov2.setNombre("Distribuidora Norte");
                prov2.setContacto("norte@distribuidora.com");
                proveedorRepo.save(prov2);

                Proveedor prov3 = new Proveedor();
                prov3.setNombre("Almacén del Sur");
                prov3.setContacto("sur@almacen.com");
                proveedorRepo.save(prov3);

                Proveedor prov4 = new Proveedor();
                prov4.setNombre("Carnes Premium");
                prov4.setContacto("info@carnespremium.com");
                proveedorRepo.save(prov4);

                Proveedor prov5 = new Proveedor();
                prov5.setNombre("Verduras Frescas");
                prov5.setContacto("ventas@verdurasfrescas.com");
                proveedorRepo.save(prov5);
                
                logger.info("✅ Proveedores cargados: {}", proveedorRepo.count());

                // ===============================================
                // 3. INSUMOS
                // ===============================================
                logger.info("🥘 Cargando Insumos...");
                Insumo ins1 = createInsumo("Carne vacuna", "kg", 0.0);
                Insumo ins2 = createInsumo("Pollo", "kg", 0.0);
                Insumo ins3 = createInsumo("Arroz", "kg", 25.0);
                Insumo ins4 = createInsumo("Papa", "kg", 1.0);
                Insumo ins5 = createInsumo("Tomate", "kg", 0.0);
                Insumo ins6 = createInsumo("Lechuga", "kg", 0.0);
                Insumo ins7 = createInsumo("Aceite", "litros", 0.0);
                Insumo ins8 = createInsumo("Harina", "kg", 0.0);
                Insumo ins9 = createInsumo("Azúcar", "kg", 0.0);
                Insumo ins10 = createInsumo("Huevos", "unidades", 300.0);
                Insumo ins11 = createInsumo("Leche", "litros", 25.0);
                Insumo ins12 = createInsumo("Dulce de leche", "kg", 0.0);
                Insumo ins13 = createInsumo("Crema", "litros", 0.0);
                Insumo ins14 = createInsumo("Vino tinto", "litros", 0.0);
                Insumo ins15 = createInsumo("Gaseosa", "litros", 25.0);

                insumoRepo.save(ins1);
                insumoRepo.save(ins2);
                insumoRepo.save(ins3);
                insumoRepo.save(ins4);
                insumoRepo.save(ins5);
                insumoRepo.save(ins6);
                insumoRepo.save(ins7);
                insumoRepo.save(ins8);
                insumoRepo.save(ins9);
                insumoRepo.save(ins10);
                insumoRepo.save(ins11);
                insumoRepo.save(ins12);
                insumoRepo.save(ins13);
                insumoRepo.save(ins14);
                insumoRepo.save(ins15);
                
                logger.info("✅ Insumos cargados: {}", insumoRepo.count());

                // ===============================================
                // 4. MENÚS
                // ===============================================
                logger.info("📋 Cargando Menús...");
                Menu menu1 = new Menu();
                menu1.setNombre("Menú Clásico");
                menu1.setPrimerPlato("Ensalada mixta");
                menu1.setSegundoPlato("Asado con guarnición");
                menu1.setTorta("Torta de dulce de leche");
                menuRepo.save(menu1);

                Menu menu2 = new Menu();
                menu2.setNombre("Menú Gourmet");
                menu2.setPrimerPlato("Carpaccio de res");
                menu2.setSegundoPlato("Suprema rellena con salsa champignones");
                menu2.setTorta("Marquise de chocolate");
                menuRepo.save(menu2);

                Menu menu3 = new Menu();
                menu3.setNombre("Menú Vegetariano");
                menu3.setPrimerPlato("Ensalada caprese");
                menu3.setSegundoPlato("Tarta de verduras con arroz");
                menu3.setTorta("Lemon pie");
                menuRepo.save(menu3);

                Menu menu4 = new Menu();
                menu4.setNombre("Menú Infantil");
                menu4.setPrimerPlato("Palitos de queso");
                menu4.setSegundoPlato("Milanesas con papas fritas");
                menu4.setTorta("Torta de vainilla");
                menuRepo.save(menu4);

                Menu menu5 = new Menu();
                menu5.setNombre("Menú Ejecutivo");
                menu5.setPrimerPlato("Tabla de fiambres");
                menu5.setSegundoPlato("Pollo al horno con papas");
                menu5.setTorta("Tiramisú");
                menuRepo.save(menu5);
                
                logger.info("✅ Menús cargados: {}", menuRepo.count());

                // ===============================================
                // 5. MENU_INSUMO (Relación Menús-Insumos)
                // ===============================================
                logger.info("🔗 Cargando relaciones Menú-Insumo...");
                
                // Menú Clásico
                menuInsumoRepo.save(createMenuInsumo(menu1, ins1, 0.25));  // Carne
                menuInsumoRepo.save(createMenuInsumo(menu1, ins4, 0.15));  // Papa
                menuInsumoRepo.save(createMenuInsumo(menu1, ins5, 0.05));  // Tomate
                menuInsumoRepo.save(createMenuInsumo(menu1, ins6, 0.03));  // Lechuga
                menuInsumoRepo.save(createMenuInsumo(menu1, ins12, 0.08)); // Dulce de leche
                menuInsumoRepo.save(createMenuInsumo(menu1, ins8, 0.05));  // Harina
                menuInsumoRepo.save(createMenuInsumo(menu1, ins7, 0.02));  // Aceite
                menuInsumoRepo.save(createMenuInsumo(menu1, ins14, 0.2));  // Vino
                menuInsumoRepo.save(createMenuInsumo(menu1, ins15, 0.3));  // Gaseosa

                // Menú Gourmet
                menuInsumoRepo.save(createMenuInsumo(menu2, ins1, 0.2));   // Carne
                menuInsumoRepo.save(createMenuInsumo(menu2, ins2, 0.2));   // Pollo
                menuInsumoRepo.save(createMenuInsumo(menu2, ins13, 0.05)); // Crema
                menuInsumoRepo.save(createMenuInsumo(menu2, ins9, 0.03));  // Azúcar
                menuInsumoRepo.save(createMenuInsumo(menu2, ins7, 0.02));  // Aceite
                menuInsumoRepo.save(createMenuInsumo(menu2, ins8, 0.03));  // Harina
                menuInsumoRepo.save(createMenuInsumo(menu2, ins14, 0.25)); // Vino
                menuInsumoRepo.save(createMenuInsumo(menu2, ins15, 0.2));  // Gaseosa

                // Menú Vegetariano
                menuInsumoRepo.save(createMenuInsumo(menu3, ins4, 0.2));   // Papa
                menuInsumoRepo.save(createMenuInsumo(menu3, ins5, 0.1));   // Tomate
                menuInsumoRepo.save(createMenuInsumo(menu3, ins6, 0.08));  // Lechuga
                menuInsumoRepo.save(createMenuInsumo(menu3, ins3, 0.1));   // Arroz
                menuInsumoRepo.save(createMenuInsumo(menu3, ins10, 2.0));  // Huevos
                menuInsumoRepo.save(createMenuInsumo(menu3, ins7, 0.03));  // Aceite
                menuInsumoRepo.save(createMenuInsumo(menu3, ins15, 0.4));  // Gaseosa
                menuInsumoRepo.save(createMenuInsumo(menu3, ins11, 0.05)); // Leche

                // Menú Infantil
                menuInsumoRepo.save(createMenuInsumo(menu4, ins2, 0.15));  // Pollo
                menuInsumoRepo.save(createMenuInsumo(menu4, ins4, 0.2));   // Papa
                menuInsumoRepo.save(createMenuInsumo(menu4, ins8, 0.08));  // Harina
                menuInsumoRepo.save(createMenuInsumo(menu4, ins9, 0.05));  // Azúcar
                menuInsumoRepo.save(createMenuInsumo(menu4, ins11, 0.1));  // Leche
                menuInsumoRepo.save(createMenuInsumo(menu4, ins7, 0.02));  // Aceite
                menuInsumoRepo.save(createMenuInsumo(menu4, ins15, 0.5));  // Gaseosa
                menuInsumoRepo.save(createMenuInsumo(menu4, ins13, 0.03)); // Crema

                // Menú Ejecutivo
                menuInsumoRepo.save(createMenuInsumo(menu5, ins2, 0.25));  // Pollo
                menuInsumoRepo.save(createMenuInsumo(menu5, ins4, 0.15));  // Papa
                menuInsumoRepo.save(createMenuInsumo(menu5, ins10, 2.0));  // Huevos
                menuInsumoRepo.save(createMenuInsumo(menu5, ins11, 0.05)); // Leche
                menuInsumoRepo.save(createMenuInsumo(menu5, ins7, 0.02));  // Aceite
                menuInsumoRepo.save(createMenuInsumo(menu5, ins8, 0.03));  // Harina
                menuInsumoRepo.save(createMenuInsumo(menu5, ins14, 0.2));  // Vino
                menuInsumoRepo.save(createMenuInsumo(menu5, ins15, 0.25)); // Gaseosa
                menuInsumoRepo.save(createMenuInsumo(menu5, ins13, 0.05)); // Crema
                
                logger.info("✅ Relaciones Menú-Insumo cargadas: {}", menuInsumoRepo.count());

                // ===============================================
                // 6. PROV_INSUMO (Relación Proveedores-Insumos)
                // ===============================================
                logger.info("🔗 Cargando relaciones Proveedor-Insumo...");
                LocalDateTime now = LocalDateTime.now();
                
                provInsumoRepo.save(createProvInsumo(prov1, ins3, 80.0, now));   // Central - Arroz
                provInsumoRepo.save(createProvInsumo(prov5, ins4, 60.0, now));   // Verduras - Papa
                provInsumoRepo.save(createProvInsumo(prov5, ins5, 40.0, now));   // Verduras - Tomate
                provInsumoRepo.save(createProvInsumo(prov5, ins6, 30.0, now));   // Verduras - Lechuga
                provInsumoRepo.save(createProvInsumo(prov2, ins7, 120.0, now));  // Norte - Aceite
                provInsumoRepo.save(createProvInsumo(prov3, ins8, 90.0, now));   // Sur - Harina
                provInsumoRepo.save(createProvInsumo(prov3, ins9, 70.0, now));   // Sur - Azúcar
                provInsumoRepo.save(createProvInsumo(prov1, ins10, 15.0, now));  // Central - Huevos
                provInsumoRepo.save(createProvInsumo(prov2, ins11, 50.0, now));  // Norte - Leche
                provInsumoRepo.save(createProvInsumo(prov3, ins12, 180.0, now)); // Sur - Dulce
                provInsumoRepo.save(createProvInsumo(prov2, ins13, 95.0, now));  // Norte - Crema
                provInsumoRepo.save(createProvInsumo(prov1, ins14, 600.0, now)); // Central - Vino
                provInsumoRepo.save(createProvInsumo(prov1, ins15, 55.0, now));  // Central - Gaseosa
                provInsumoRepo.save(createProvInsumo(prov5, ins2, 350.0, now));  // Verduras - Pollo
                provInsumoRepo.save(createProvInsumo(prov1, ins1, 0.0, now));    // Central - Carne
                
                logger.info("✅ Relaciones Proveedor-Insumo cargadas: {}", provInsumoRepo.count());

                logger.info("🎉 ¡Datos maestros inicializados correctamente!");
            } else {
                logger.info("ℹ️  Datos maestros ya existen, omitiendo inicialización.");
            }
        };
    }

    // Métodos auxiliares para crear objetos
    private Insumo createInsumo(String nombre, String unidad, Double cantidad) {
        Insumo insumo = new Insumo();
        insumo.setNombre(nombre);
        insumo.setUnidadMedida(unidad);
        insumo.setCantidadActual(cantidad);
        insumo.setFechaActualizacion(LocalDateTime.now());
        return insumo;
    }

    private MenuInsumo createMenuInsumo(Menu menu, Insumo insumo, Double cantidad) {
        MenuInsumo mi = new MenuInsumo();
        mi.setMenu(menu);
        mi.setInsumo(insumo);
        mi.setCantidadPorPersona(cantidad);
        return mi;
    }

    private ProvInsumo createProvInsumo(Proveedor prov, Insumo insumo, Double precio, LocalDateTime fecha) {
        ProvInsumo pi = new ProvInsumo();
        pi.setProveedor(prov);
        pi.setInsumo(insumo);
        pi.setPrecioUnitario(precio);
        pi.setFechaActualizacion(fecha);
        return pi;
    }
}

package com.eventos.config;

import com.eventos.model.*;
import com.eventos.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final ExtraRepository extraRepository;
    private final MenuRepository menuRepository;
    private final InsumoRepository insumoRepository;
    private final MenuInsumoRepository menuInsumoRepository;
    private final ProveedorRepository proveedorRepository;
    private final ProvInsumoRepository provInsumoRepository;

    public DataInitializer(
            ExtraRepository extraRepository,
            MenuRepository menuRepository,
            InsumoRepository insumoRepository,
            MenuInsumoRepository menuInsumoRepository,
            ProveedorRepository proveedorRepository,
            ProvInsumoRepository provInsumoRepository
    ) {
        this.extraRepository = extraRepository;
        this.menuRepository = menuRepository;
        this.insumoRepository = insumoRepository;
        this.menuInsumoRepository = menuInsumoRepository;
        this.proveedorRepository = proveedorRepository;
        this.provInsumoRepository = provInsumoRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        logger.info("=== Verificando datos iniciales ===");

        if (extraRepository.count() == 0) {
            logger.info("Cargando extras iniciales...");
            cargarExtras();
        } else {
            logger.info("Extras ya cargados. Total: {}", extraRepository.count());
        }

        if (menuRepository.count() == 0) {
            logger.info("Cargando menús iniciales...");
            cargarMenus();
        } else {
            logger.info("Menús ya cargados. Total: {}", menuRepository.count());
        }

        if (insumoRepository.count() == 0) {
            logger.info("Cargando insumos iniciales...");
            cargarInsumos();
        } else {
            logger.info("Insumos ya cargados. Total: {}", insumoRepository.count());
        }

        if (proveedorRepository.count() == 0) {
            logger.info("Cargando proveedores iniciales...");
            cargarProveedores();
        } else {
            logger.info("Proveedores ya cargados. Total: {}", proveedorRepository.count());
        }

        if (menuInsumoRepository.count() == 0) {
            logger.info("Cargando relaciones menú-insumo...");
            cargarMenuInsumos();
        } else {
            logger.info("Relaciones menú-insumo ya cargadas. Total: {}", menuInsumoRepository.count());
        }

        if (provInsumoRepository.count() == 0) {
            logger.info("Cargando relaciones proveedor-insumo...");
            cargarProvInsumos();
        } else {
            logger.info("Relaciones proveedor-insumo ya cargadas. Total: {}", provInsumoRepository.count());
        }

        logger.info("=== Inicialización de datos completada ===");
    }

    private void cargarExtras() {
        List<Extra> extras = new ArrayList<>();
        
        extras.add(crearExtra("Torta personalizada", "Diseño temático", 45000.0));
        extras.add(crearExtra("DJ", "Servicio musical 5 horas", 120000.0));
        extras.add(crearExtra("Decoración premium", "Ambientación completa", 95000.0));
        extras.add(crearExtra("Souvenirs", "Recuerdos personalizados", 30000.0));
        extras.add(crearExtra("Kit Carioca", "Cotillón luminoso", 18000.0));

        extraRepository.saveAll(extras);
        logger.info("✓ {} extras cargados", extras.size());
    }

    private Extra crearExtra(String nombre, String descripcion, Double precio) {
        Extra extra = new Extra();
        extra.setNombre(nombre);
        extra.setDescripcion(descripcion);
        extra.setPrecio(precio);
        return extra;
    }

    private void cargarMenus() {
        List<Menu> menus = new ArrayList<>();
        
        menus.add(crearMenu("Menú Clásico", "Ensalada mixta", "Asado con guarnición", "Torta de dulce de leche"));
        menus.add(crearMenu("Menú Gourmet", "Carpaccio de res", "Suprema rellena con salsa champignones", "Marquise de chocolate"));
        menus.add(crearMenu("Menú Vegetariano", "Ensalada caprese", "Tarta de verduras con arroz", "Lemon pie"));
        menus.add(crearMenu("Menú Infantil", "Palitos de queso", "Milanesas con papas fritas", "Torta de vainilla"));
        menus.add(crearMenu("Menú Ejecutivo", "Tabla de fiambres", "Pollo al horno con papas", "Tiramisú"));

        menuRepository.saveAll(menus);
        logger.info("✓ {} menús cargados", menus.size());
    }

    private Menu crearMenu(String nombre, String primerPlato, String segundoPlato, String torta) {
        Menu menu = new Menu();
        menu.setNombre(nombre);
        menu.setPrimerPlato(primerPlato);
        menu.setSegundoPlato(segundoPlato);
        menu.setTorta(torta);
        return menu;
    }

    private void cargarInsumos() {
        List<Insumo> insumos = new ArrayList<>();
        
        insumos.add(crearInsumo("Carne vacuna", "kg", 50.0));
        insumos.add(crearInsumo("Pollo", "kg", 40.0));
        insumos.add(crearInsumo("Arroz", "kg", 30.0));
        insumos.add(crearInsumo("Papa", "kg", 100.0));
        insumos.add(crearInsumo("Tomate", "kg", 25.0));
        insumos.add(crearInsumo("Lechuga", "kg", 15.0));
        insumos.add(crearInsumo("Aceite", "litros", 20.0));
        insumos.add(crearInsumo("Harina", "kg", 50.0));
        insumos.add(crearInsumo("Azúcar", "kg", 40.0));
        insumos.add(crearInsumo("Huevos", "unidades", 200.0));
        insumos.add(crearInsumo("Leche", "litros", 30.0));
        insumos.add(crearInsumo("Dulce de leche", "kg", 10.0));
        insumos.add(crearInsumo("Crema", "litros", 15.0));
        insumos.add(crearInsumo("Vino tinto", "litros", 25.0));
        insumos.add(crearInsumo("Gaseosa", "litros", 60.0));

        insumoRepository.saveAll(insumos);
        logger.info("✓ {} insumos cargados", insumos.size());
    }

    private Insumo crearInsumo(String nombre, String unidadMedida, Double cantidadInicial) {
        Insumo insumo = new Insumo();
        insumo.setNombre(nombre);
        insumo.setUnidadMedida(unidadMedida);
        insumo.setCantidadActual(cantidadInicial);
        insumo.setFechaActualizacion(LocalDateTime.now());
        return insumo;
    }

    private void cargarProveedores() {
        List<Proveedor> proveedores = new ArrayList<>();
        
        proveedores.add(crearProveedor("Proveedor Central", "central@proveedores.com"));
        proveedores.add(crearProveedor("Distribuidora Norte", "norte@distribuidora.com"));
        proveedores.add(crearProveedor("Almacén del Sur", "sur@almacen.com"));
        proveedores.add(crearProveedor("Carnes Premium", "info@carnespremium.com"));
        proveedores.add(crearProveedor("Verduras Frescas", "ventas@verdurasfrescas.com"));

        proveedorRepository.saveAll(proveedores);
        logger.info("✓ {} proveedores cargados", proveedores.size());
    }

    private Proveedor crearProveedor(String nombre, String contacto) {
        Proveedor proveedor = new Proveedor();
        proveedor.setNombre(nombre);
        proveedor.setContacto(contacto);
        proveedor.setPrecio(0.0);
        return proveedor;
    }

    private void cargarMenuInsumos() {
        List<Menu> menus = menuRepository.findAll();
        List<Insumo> insumos = insumoRepository.findAll();
        
        if (menus.size() < 5 || insumos.size() < 15) {
            logger.warn("No hay suficientes menús ({}) o insumos ({}) para crear relaciones", 
                        menus.size(), insumos.size());
            return;
        }

        List<MenuInsumo> menuInsumos = new ArrayList<>();
        
        menuInsumos.add(crearMenuInsumo(menus.get(0), insumos.get(0), 0.25));
        menuInsumos.add(crearMenuInsumo(menus.get(0), insumos.get(3), 0.15));
        menuInsumos.add(crearMenuInsumo(menus.get(0), insumos.get(4), 0.05));
        menuInsumos.add(crearMenuInsumo(menus.get(0), insumos.get(5), 0.03));
        menuInsumos.add(crearMenuInsumo(menus.get(0), insumos.get(6), 0.02));
        menuInsumos.add(crearMenuInsumo(menus.get(0), insumos.get(7), 0.05));
        menuInsumos.add(crearMenuInsumo(menus.get(0), insumos.get(11), 0.08));
        menuInsumos.add(crearMenuInsumo(menus.get(0), insumos.get(13), 0.2));
        menuInsumos.add(crearMenuInsumo(menus.get(0), insumos.get(14), 0.3));
        
        menuInsumos.add(crearMenuInsumo(menus.get(1), insumos.get(0), 0.2));
        menuInsumos.add(crearMenuInsumo(menus.get(1), insumos.get(1), 0.2));
        menuInsumos.add(crearMenuInsumo(menus.get(1), insumos.get(6), 0.02));
        menuInsumos.add(crearMenuInsumo(menus.get(1), insumos.get(7), 0.03));
        menuInsumos.add(crearMenuInsumo(menus.get(1), insumos.get(8), 0.03));
        menuInsumos.add(crearMenuInsumo(menus.get(1), insumos.get(12), 0.05));
        menuInsumos.add(crearMenuInsumo(menus.get(1), insumos.get(13), 0.25));
        menuInsumos.add(crearMenuInsumo(menus.get(1), insumos.get(14), 0.2));
        
        menuInsumos.add(crearMenuInsumo(menus.get(2), insumos.get(2), 0.1));
        menuInsumos.add(crearMenuInsumo(menus.get(2), insumos.get(3), 0.2));
        menuInsumos.add(crearMenuInsumo(menus.get(2), insumos.get(4), 0.1));
        menuInsumos.add(crearMenuInsumo(menus.get(2), insumos.get(5), 0.08));
        menuInsumos.add(crearMenuInsumo(menus.get(2), insumos.get(6), 0.03));
        menuInsumos.add(crearMenuInsumo(menus.get(2), insumos.get(9), 2.0));
        menuInsumos.add(crearMenuInsumo(menus.get(2), insumos.get(10), 0.05));
        menuInsumos.add(crearMenuInsumo(menus.get(2), insumos.get(14), 0.4));
        
        menuInsumos.add(crearMenuInsumo(menus.get(3), insumos.get(1), 0.15));
        menuInsumos.add(crearMenuInsumo(menus.get(3), insumos.get(3), 0.2));
        menuInsumos.add(crearMenuInsumo(menus.get(3), insumos.get(6), 0.02));
        menuInsumos.add(crearMenuInsumo(menus.get(3), insumos.get(7), 0.08));
        menuInsumos.add(crearMenuInsumo(menus.get(3), insumos.get(8), 0.05));
        menuInsumos.add(crearMenuInsumo(menus.get(3), insumos.get(10), 0.1));
        menuInsumos.add(crearMenuInsumo(menus.get(3), insumos.get(12), 0.03));
        menuInsumos.add(crearMenuInsumo(menus.get(3), insumos.get(14), 0.5));
        
        menuInsumos.add(crearMenuInsumo(menus.get(4), insumos.get(1), 0.25));
        menuInsumos.add(crearMenuInsumo(menus.get(4), insumos.get(3), 0.15));
        menuInsumos.add(crearMenuInsumo(menus.get(4), insumos.get(6), 0.02));
        menuInsumos.add(crearMenuInsumo(menus.get(4), insumos.get(7), 0.03));
        menuInsumos.add(crearMenuInsumo(menus.get(4), insumos.get(9), 2.0));
        menuInsumos.add(crearMenuInsumo(menus.get(4), insumos.get(10), 0.05));
        menuInsumos.add(crearMenuInsumo(menus.get(4), insumos.get(12), 0.05));
        menuInsumos.add(crearMenuInsumo(menus.get(4), insumos.get(13), 0.2));
        menuInsumos.add(crearMenuInsumo(menus.get(4), insumos.get(14), 0.25));

        menuInsumoRepository.saveAll(menuInsumos);
        logger.info("✓ {} relaciones menú-insumo cargadas", menuInsumos.size());
    }

    private MenuInsumo crearMenuInsumo(Menu menu, Insumo insumo, Double cantidadPorPersona) {
        MenuInsumo menuInsumo = new MenuInsumo();
        menuInsumo.setMenu(menu);
        menuInsumo.setInsumo(insumo);
        menuInsumo.setCantidadPorPersona(cantidadPorPersona);
        return menuInsumo;
    }

    private void cargarProvInsumos() {
        List<Proveedor> proveedores = proveedorRepository.findAll();
        List<Insumo> insumos = insumoRepository.findAll();
        
        if (proveedores.size() < 5 || insumos.size() < 15) {
            logger.warn("No hay suficientes proveedores ({}) o insumos ({}) para crear relaciones", 
                        proveedores.size(), insumos.size());
            return;
        }

        Proveedor proveedorCentral = proveedores.stream()
                .filter(p -> "Proveedor Central".equals(p.getNombre()))
                .findFirst().orElse(null);
        Proveedor distribuidoraNorte = proveedores.stream()
                .filter(p -> "Distribuidora Norte".equals(p.getNombre()))
                .findFirst().orElse(null);
        Proveedor almacenSur = proveedores.stream()
                .filter(p -> "Almacén del Sur".equals(p.getNombre()))
                .findFirst().orElse(null);
        Proveedor verdurasFrescas = proveedores.stream()
                .filter(p -> "Verduras Frescas".equals(p.getNombre()))
                .findFirst().orElse(null);

        if (proveedorCentral == null || distribuidoraNorte == null || 
            almacenSur == null || verdurasFrescas == null) {
            logger.error("No se encontraron todos los proveedores necesarios por nombre");
            return;
        }

        List<ProvInsumo> provInsumos = new ArrayList<>();
        LocalDateTime ahora = LocalDateTime.now();
        
        provInsumos.add(crearProvInsumo(proveedorCentral, insumos.get(0), 3500.0, ahora));
        provInsumos.add(crearProvInsumo(proveedorCentral, insumos.get(2), 80.0, ahora));
        provInsumos.add(crearProvInsumo(proveedorCentral, insumos.get(9), 15.0, ahora));
        provInsumos.add(crearProvInsumo(proveedorCentral, insumos.get(13), 600.0, ahora));
        provInsumos.add(crearProvInsumo(proveedorCentral, insumos.get(14), 55.0, ahora));
        
        provInsumos.add(crearProvInsumo(distribuidoraNorte, insumos.get(6), 120.0, ahora));
        provInsumos.add(crearProvInsumo(distribuidoraNorte, insumos.get(10), 50.0, ahora));
        provInsumos.add(crearProvInsumo(distribuidoraNorte, insumos.get(12), 95.0, ahora));
        
        provInsumos.add(crearProvInsumo(almacenSur, insumos.get(7), 90.0, ahora));
        provInsumos.add(crearProvInsumo(almacenSur, insumos.get(8), 70.0, ahora));
        provInsumos.add(crearProvInsumo(almacenSur, insumos.get(11), 180.0, ahora));
        
        provInsumos.add(crearProvInsumo(verdurasFrescas, insumos.get(1), 350.0, ahora));
        provInsumos.add(crearProvInsumo(verdurasFrescas, insumos.get(3), 60.0, ahora));
        provInsumos.add(crearProvInsumo(verdurasFrescas, insumos.get(4), 40.0, ahora));
        provInsumos.add(crearProvInsumo(verdurasFrescas, insumos.get(5), 30.0, ahora));

        provInsumoRepository.saveAll(provInsumos);
        logger.info("✓ {} relaciones proveedor-insumo cargadas", provInsumos.size());
    }

    private ProvInsumo crearProvInsumo(Proveedor proveedor, Insumo insumo, Double precioUnitario, LocalDateTime fecha) {
        ProvInsumo provInsumo = new ProvInsumo();
        provInsumo.setProveedor(proveedor);
        provInsumo.setInsumo(insumo);
        provInsumo.setPrecioUnitario(precioUnitario);
        provInsumo.setFechaActualizacion(fecha);
        return provInsumo;
    }
}

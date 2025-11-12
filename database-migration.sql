--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (415ebe8)
-- Dumped by pg_dump version 16.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.evento_extra DROP CONSTRAINT IF EXISTS fkpher8dvl3weymdaop9eoqv88b;
ALTER TABLE IF EXISTS ONLY public.orden_compra DROP CONSTRAINT IF EXISTS fkpgp1ooe3wmycq29kdj6qydybp;
ALTER TABLE IF EXISTS ONLY public.evento_extra DROP CONSTRAINT IF EXISTS fkjrorm5d4yj3jve596fvbdct3n;
ALTER TABLE IF EXISTS ONLY public.prov_insumo DROP CONSTRAINT IF EXISTS fkfmyctv7734tvuix4mgwgwslg1;
ALTER TABLE IF EXISTS ONLY public.menu_insumo DROP CONSTRAINT IF EXISTS fkd5bnuk5oatvk7golwgrm96c3s;
ALTER TABLE IF EXISTS ONLY public.menu_insumo DROP CONSTRAINT IF EXISTS fkc9g6pmk9wc9enynvd51f0q38h;
ALTER TABLE IF EXISTS ONLY public.evento DROP CONSTRAINT IF EXISTS fk69k6h2afbe7k2y3fibsqocqs;
ALTER TABLE IF EXISTS ONLY public.prov_insumo DROP CONSTRAINT IF EXISTS fk5qqmj6ud2tsd4rn0vm4n5ggq5;
ALTER TABLE IF EXISTS ONLY public.orden_compra DROP CONSTRAINT IF EXISTS fk5c6m350aqy0wu4nfjm3ry211u;
ALTER TABLE IF EXISTS ONLY public.orden_compra_detalle DROP CONSTRAINT IF EXISTS fk1sflux105nsm1mnk147g711nm;
ALTER TABLE IF EXISTS ONLY public.orden_compra_detalle DROP CONSTRAINT IF EXISTS fk1lg1lk51ugncl3ysqg8wh7ege;
ALTER TABLE IF EXISTS ONLY public.usuario DROP CONSTRAINT IF EXISTS usuario_pkey;
ALTER TABLE IF EXISTS ONLY public.usuario DROP CONSTRAINT IF EXISTS uk_863n1y3x0jalatoir4325ehal;
ALTER TABLE IF EXISTS ONLY public.proveedor DROP CONSTRAINT IF EXISTS proveedor_pkey;
ALTER TABLE IF EXISTS ONLY public.prov_insumo DROP CONSTRAINT IF EXISTS prov_insumo_pkey;
ALTER TABLE IF EXISTS ONLY public.orden_compra DROP CONSTRAINT IF EXISTS orden_compra_pkey;
ALTER TABLE IF EXISTS ONLY public.orden_compra_detalle DROP CONSTRAINT IF EXISTS orden_compra_detalle_pkey;
ALTER TABLE IF EXISTS ONLY public.menu DROP CONSTRAINT IF EXISTS menu_pkey;
ALTER TABLE IF EXISTS ONLY public.menu_insumo DROP CONSTRAINT IF EXISTS menu_insumo_pkey;
ALTER TABLE IF EXISTS ONLY public.insumo DROP CONSTRAINT IF EXISTS insumo_pkey;
ALTER TABLE IF EXISTS ONLY public.extra DROP CONSTRAINT IF EXISTS extra_pkey;
ALTER TABLE IF EXISTS ONLY public.evento DROP CONSTRAINT IF EXISTS evento_pkey;
ALTER TABLE IF EXISTS ONLY public.evento_extra DROP CONSTRAINT IF EXISTS evento_extra_pkey;
ALTER TABLE IF EXISTS public.usuario ALTER COLUMN id_usuario DROP DEFAULT;
ALTER TABLE IF EXISTS public.proveedor ALTER COLUMN id_proveedor DROP DEFAULT;
ALTER TABLE IF EXISTS public.prov_insumo ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.orden_compra_detalle ALTER COLUMN id_oc_det DROP DEFAULT;
ALTER TABLE IF EXISTS public.orden_compra ALTER COLUMN id_oc DROP DEFAULT;
ALTER TABLE IF EXISTS public.menu_insumo ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.menu ALTER COLUMN id_menu DROP DEFAULT;
ALTER TABLE IF EXISTS public.insumo ALTER COLUMN id_insumo DROP DEFAULT;
ALTER TABLE IF EXISTS public.extra ALTER COLUMN id_extra DROP DEFAULT;
ALTER TABLE IF EXISTS public.evento_extra ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.evento ALTER COLUMN id_evento DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.usuario_id_usuario_seq;
DROP TABLE IF EXISTS public.usuario;
DROP SEQUENCE IF EXISTS public.proveedor_id_proveedor_seq;
DROP TABLE IF EXISTS public.proveedor;
DROP SEQUENCE IF EXISTS public.prov_insumo_id_seq;
DROP TABLE IF EXISTS public.prov_insumo;
DROP SEQUENCE IF EXISTS public.orden_compra_id_oc_seq;
DROP SEQUENCE IF EXISTS public.orden_compra_detalle_id_oc_det_seq;
DROP TABLE IF EXISTS public.orden_compra_detalle;
DROP TABLE IF EXISTS public.orden_compra;
DROP SEQUENCE IF EXISTS public.menu_insumo_id_seq;
DROP TABLE IF EXISTS public.menu_insumo;
DROP SEQUENCE IF EXISTS public.menu_id_menu_seq;
DROP TABLE IF EXISTS public.menu;
DROP SEQUENCE IF EXISTS public.insumo_id_insumo_seq;
DROP TABLE IF EXISTS public.insumo;
DROP SEQUENCE IF EXISTS public.extra_id_extra_seq;
DROP TABLE IF EXISTS public.extra;
DROP SEQUENCE IF EXISTS public.evento_id_evento_seq;
DROP SEQUENCE IF EXISTS public.evento_extra_id_seq;
DROP TABLE IF EXISTS public.evento_extra;
DROP TABLE IF EXISTS public.evento;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: evento; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.evento (
    id_evento bigint NOT NULL,
    cantidad_asistentes integer NOT NULL,
    fecha date NOT NULL,
    itinerario character varying(255),
    mail_cliente character varying(255),
    nombre_cliente character varying(255),
    tipo_evento character varying(255),
    id_menu bigint
);


--
-- Name: evento_extra; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.evento_extra (
    id bigint NOT NULL,
    descripcion character varying(255),
    id_evento bigint NOT NULL,
    id_extra bigint NOT NULL
);


--
-- Name: evento_extra_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.evento_extra_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: evento_extra_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.evento_extra_id_seq OWNED BY public.evento_extra.id;


--
-- Name: evento_id_evento_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.evento_id_evento_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: evento_id_evento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.evento_id_evento_seq OWNED BY public.evento.id_evento;


--
-- Name: extra; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.extra (
    id_extra bigint NOT NULL,
    descripcion character varying(255),
    nombre character varying(255) NOT NULL,
    precio double precision
);


--
-- Name: extra_id_extra_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.extra_id_extra_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: extra_id_extra_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.extra_id_extra_seq OWNED BY public.extra.id_extra;


--
-- Name: insumo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.insumo (
    id_insumo bigint NOT NULL,
    cantidad_actual double precision NOT NULL,
    fecha_actualizacion timestamp(6) without time zone,
    nombre character varying(255) NOT NULL,
    unidad_medida character varying(255) NOT NULL
);


--
-- Name: insumo_id_insumo_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.insumo_id_insumo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: insumo_id_insumo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.insumo_id_insumo_seq OWNED BY public.insumo.id_insumo;


--
-- Name: menu; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.menu (
    id_menu bigint NOT NULL,
    nombre character varying(255) NOT NULL,
    primer_plato character varying(255),
    segundo_plato character varying(255),
    torta character varying(255)
);


--
-- Name: menu_id_menu_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.menu_id_menu_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: menu_id_menu_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.menu_id_menu_seq OWNED BY public.menu.id_menu;


--
-- Name: menu_insumo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.menu_insumo (
    id bigint NOT NULL,
    cantidad_por_persona double precision NOT NULL,
    id_insumo bigint NOT NULL,
    id_menu bigint NOT NULL
);


--
-- Name: menu_insumo_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.menu_insumo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: menu_insumo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.menu_insumo_id_seq OWNED BY public.menu_insumo.id;


--
-- Name: orden_compra; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orden_compra (
    id_oc bigint NOT NULL,
    estado character varying(255),
    fecha_emision date NOT NULL,
    fecha_necesidad date,
    total double precision,
    id_proveedor bigint NOT NULL,
    fecha_recepcion date,
    id_evento bigint,
    CONSTRAINT orden_compra_estado_check CHECK (((estado)::text = ANY ((ARRAY['PENDIENTE'::character varying, 'PROCESANDO'::character varying, 'COMPLETADA'::character varying, 'RECIBIDA'::character varying, 'PARCIAL'::character varying, 'CANCELADA'::character varying])::text[])))
);


--
-- Name: orden_compra_detalle; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orden_compra_detalle (
    id_oc_det bigint NOT NULL,
    cantidad_pedida double precision NOT NULL,
    cantidad_recibida double precision,
    estado_linea character varying(255),
    precio_unitario double precision NOT NULL,
    id_insumo bigint NOT NULL,
    id_oc bigint NOT NULL,
    CONSTRAINT orden_compra_detalle_estado_linea_check CHECK (((estado_linea)::text = ANY ((ARRAY['PENDIENTE'::character varying, 'PARCIAL'::character varying, 'RECIBIDA'::character varying])::text[])))
);


--
-- Name: orden_compra_detalle_id_oc_det_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.orden_compra_detalle_id_oc_det_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: orden_compra_detalle_id_oc_det_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.orden_compra_detalle_id_oc_det_seq OWNED BY public.orden_compra_detalle.id_oc_det;


--
-- Name: orden_compra_id_oc_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.orden_compra_id_oc_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: orden_compra_id_oc_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.orden_compra_id_oc_seq OWNED BY public.orden_compra.id_oc;


--
-- Name: prov_insumo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.prov_insumo (
    id bigint NOT NULL,
    fecha_actualizacion timestamp(6) without time zone,
    precio_unitario double precision NOT NULL,
    id_insumo bigint NOT NULL,
    id_proveedor bigint NOT NULL
);


--
-- Name: prov_insumo_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.prov_insumo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: prov_insumo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.prov_insumo_id_seq OWNED BY public.prov_insumo.id;


--
-- Name: proveedor; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.proveedor (
    id_proveedor bigint NOT NULL,
    contacto character varying(255),
    nombre character varying(255) NOT NULL,
    precio double precision
);


--
-- Name: proveedor_id_proveedor_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.proveedor_id_proveedor_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: proveedor_id_proveedor_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.proveedor_id_proveedor_seq OWNED BY public.proveedor.id_proveedor;


--
-- Name: usuario; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usuario (
    id_usuario bigint NOT NULL,
    activo boolean NOT NULL,
    fecha_creacion timestamp(6) without time zone,
    nombre character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    rol character varying(255) NOT NULL,
    username character varying(255) NOT NULL,
    CONSTRAINT usuario_rol_check CHECK (((rol)::text = ANY ((ARRAY['ADMINISTRADOR'::character varying, 'ENCARGADA_COCINA'::character varying, 'ORGANIZADOR_EVENTOS'::character varying])::text[])))
);


--
-- Name: usuario_id_usuario_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.usuario_id_usuario_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: usuario_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.usuario_id_usuario_seq OWNED BY public.usuario.id_usuario;


--
-- Name: evento id_evento; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evento ALTER COLUMN id_evento SET DEFAULT nextval('public.evento_id_evento_seq'::regclass);


--
-- Name: evento_extra id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evento_extra ALTER COLUMN id SET DEFAULT nextval('public.evento_extra_id_seq'::regclass);


--
-- Name: extra id_extra; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.extra ALTER COLUMN id_extra SET DEFAULT nextval('public.extra_id_extra_seq'::regclass);


--
-- Name: insumo id_insumo; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.insumo ALTER COLUMN id_insumo SET DEFAULT nextval('public.insumo_id_insumo_seq'::regclass);


--
-- Name: menu id_menu; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu ALTER COLUMN id_menu SET DEFAULT nextval('public.menu_id_menu_seq'::regclass);


--
-- Name: menu_insumo id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu_insumo ALTER COLUMN id SET DEFAULT nextval('public.menu_insumo_id_seq'::regclass);


--
-- Name: orden_compra id_oc; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orden_compra ALTER COLUMN id_oc SET DEFAULT nextval('public.orden_compra_id_oc_seq'::regclass);


--
-- Name: orden_compra_detalle id_oc_det; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orden_compra_detalle ALTER COLUMN id_oc_det SET DEFAULT nextval('public.orden_compra_detalle_id_oc_det_seq'::regclass);


--
-- Name: prov_insumo id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.prov_insumo ALTER COLUMN id SET DEFAULT nextval('public.prov_insumo_id_seq'::regclass);


--
-- Name: proveedor id_proveedor; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.proveedor ALTER COLUMN id_proveedor SET DEFAULT nextval('public.proveedor_id_proveedor_seq'::regclass);


--
-- Name: usuario id_usuario; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuario_id_usuario_seq'::regclass);


--
-- Data for Name: evento; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.evento (id_evento, cantidad_asistentes, fecha, itinerario, mail_cliente, nombre_cliente, tipo_evento, id_menu) FROM stdin;
2	50	2025-11-20	16:00 Inicio - 17:00 Merienda - 18:00 Juegos	pedro.martinez@email.com	Pedro Martínez	Cumpleaños	4
4	100	2025-12-01	20:00 Aperitivo - 21:00 Cena - 23:00 Brindis	laura.rodriguez@email.com	Laura Rodríguez	Aniversario	1
5	200	2025-12-10	21:00 Cena - 23:00 Fiesta - 02:00 Cierre	eventos@sanmartin.edu.ar	Colegio San Martín	Fiesta de egresados	1
6	60	2025-12-15	20:00 Recepción - 21:00 Cena - 23:00 Intercambio	administracion@clubsocial.com	Club Social	Cena navideña	3
7	80	2025-09-15	Ceremonia 18:00, Cena 20:00	juan.perez@mail.com	Juan Pérez	Boda	2
8	50	2025-08-22	Recepción 19:00, Cena 20:30	laura.martinez@mail.com	Laura Martínez	Cumpleaños	1
9	120	2025-10-05	Presentación 10:00, Almuerzo 13:00	eventos@xyz.com	Corporación XYZ	Evento Corporativo	5
10	40	2025-07-10	Brindis 19:00, Cena 20:00	gonzalez@mail.com	Familia González	Aniversario	2
11	60	2025-09-28	Recepción 18:30, Cena 20:00	club@deportivo.com	Club Deportivo	Evento Social	1
12	35	2025-08-05	Juegos 16:00, Merienda 18:00	ana.rodriguez@mail.com	Ana Rodríguez	Cumpleaños Infantil	4
13	90	2025-10-18	Cena 21:00, Show 23:00	rrhh@tech.com	Empresa Tech	Fin de Año	2
15	100	2025-12-13	kjkjiiiiiiiiiiiiii	sofiam.leguiza@gmail.com	Luis Alberto	casamiento	5
1	150	2025-11-15	19:00 Recepción - 20:00 Cena - 22:00 Baile	maria.gonzalez@email.com	María González	Casamiento	3
17	100	2025-10-20	Recepción 19:00, Cena 20:30, Show 22:00	contacto@laplata.com	Aniversario La Plata	Aniversario	1
18	150	2025-12-30	Coctel 21:00, Cena 22:00, Fiesta 00:00	admin@empresatech.com	Fiesta Fin de Año	Evento Corporativo	5
19	60	2025-11-19	Merienda 17:00, Torta 18:30	sofia@email.com	Cumpleaños Sofía	Cumpleaños	4
20	200	2025-11-23	Ceremonia 18:00, Recepción 19:30, Cena 21:00	mariaylucas@email.com	Casamiento María y Lucas	Casamiento	2
21	80	2025-11-18	Almuerzo 12:30, Presentación 14:00	eventos@techsa.com	Evento Corporativo TechSA	Evento Corporativo	3
3	80	2025-11-25	12:00 Almuerzo - 13:30 Charla - 15:00 Coffee break	eventos@techsa.com	Empresa Tech SA	Evento Corporativo	2
\.


--
-- Data for Name: evento_extra; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.evento_extra (id, descripcion, id_evento, id_extra) FROM stdin;
1	Torta temática personalizada	19	1
2	Servicio completo DJ	18	2
3	Servicio completo DJ	20	2
4	Decoración premium completa	20	3
5	Souvenirs personalizados	19	4
6	Souvenirs personalizados	20	4
7	Kit carioca luminoso	18	5
8	Ambientación completa	3	3
9	Cotillón luminoso	3	5
\.


--
-- Data for Name: extra; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.extra (id_extra, descripcion, nombre, precio) FROM stdin;
1	Diseño temático	Torta personalizada	45000
2	Servicio musical 5 horas	DJ	120000
3	Ambientación completa	Decoración premium	95000
4	Recuerdos personalizados	Souvenirs	30000
5	Cotillón luminoso	Kit Carioca	18000
\.


--
-- Data for Name: insumo; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.insumo (id_insumo, cantidad_actual, fecha_actualizacion, nombre, unidad_medida) FROM stdin;
2	30	2025-11-10 00:07:46.25641	Pollo	kg
3	25	2025-11-10 00:07:46.25641	Arroz	kg
9	15	2025-11-10 00:07:46.25641	Azúcar	kg
10	200	2025-11-10 00:07:46.25641	Huevos	unidades
11	25	2025-11-10 00:07:46.25641	Leche	litros
13	10	2025-11-10 00:07:46.25641	Crema	litros
1	50	2025-11-11 02:10:40.522216	Carne vacuna	kg
4	38	2025-11-11 02:10:40.518454	Papa	kg
6	3	2025-11-11 02:10:40.927639	Lechuga	kg
7	1	2025-11-11 02:10:40.930395	Aceite	litros
8	2	2025-11-11 02:10:41.245371	Harina	kg
12	2	2025-11-11 02:10:41.321204	Dulce de leche	kg
14	30	2025-11-11 02:10:41.344416	Vino tinto	litros
15	50	2025-11-11 02:10:41.594185	Gaseosa	litros
5	15	2025-11-11 02:10:40.522647	Tomate	kg
\.


--
-- Data for Name: menu; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.menu (id_menu, nombre, primer_plato, segundo_plato, torta) FROM stdin;
1	Menú Clásico	Ensalada mixta	Asado con guarnición	Torta de dulce de leche
2	Menú Gourmet	Carpaccio de res	Suprema rellena con salsa champignones	Marquise de chocolate
3	Menú Vegetariano	Ensalada caprese	Tarta de verduras con arroz	Lemon pie
4	Menú Infantil	Palitos de queso	Milanesas con papas fritas	Torta de vainilla
5	Menú Ejecutivo	Tabla de fiambres	Pollo al horno con papas	Tiramisú
\.


--
-- Data for Name: menu_insumo; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.menu_insumo (id, cantidad_por_persona, id_insumo, id_menu) FROM stdin;
1	0.25	1	1
2	0.15	4	1
3	0.05	5	1
4	0.03	6	1
5	0.08	12	1
6	0.05	8	1
7	0.2	1	2
8	0.2	2	2
9	0.05	13	2
10	0.03	9	2
11	0.2	4	3
12	0.1	5	3
13	0.08	6	3
14	0.1	3	3
15	2	10	3
16	0.15	2	4
17	0.2	4	4
18	0.08	8	4
19	0.05	9	4
20	0.1	11	4
21	0.25	2	5
22	0.15	4	5
23	2	10	5
24	0.05	11	5
25	0.02	7	1
26	0.2	14	1
27	0.3	15	1
28	0.02	7	2
29	0.03	8	2
30	0.25	14	2
31	0.2	15	2
32	0.03	7	3
33	0.4	15	3
34	0.05	11	3
35	0.02	7	4
36	0.5	15	4
37	0.03	13	4
38	0.02	7	5
39	0.03	8	5
40	0.2	14	5
41	0.25	15	5
42	0.05	13	5
\.


--
-- Data for Name: orden_compra; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orden_compra (id_oc, estado, fecha_emision, fecha_necesidad, total, id_proveedor, fecha_recepcion, id_evento) FROM stdin;
1	RECIBIDA	2025-11-11	2025-12-01	0	5	2025-11-11	4
2	PARCIAL	2025-11-11	2025-11-15	0	5	2025-11-10	1
4	PENDIENTE	2025-11-11	2025-11-15	0	5	\N	1
5	PENDIENTE	2025-11-12	2025-11-15	0	5	\N	1
3	RECIBIDA	2025-11-11	2025-11-15	0	5	2025-11-11	1
6	PENDIENTE	2025-11-12	2025-11-15	0	5	\N	1
\.


--
-- Data for Name: orden_compra_detalle; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orden_compra_detalle (id_oc_det, cantidad_pedida, cantidad_recibida, estado_linea, precio_unitario, id_insumo, id_oc) FROM stdin;
2	2	\N	PENDIENTE	0	5	1
4	12	\N	PENDIENTE	0	5	2
5	9	\N	PENDIENTE	0	6	2
6	100	\N	PENDIENTE	0	10	2
7	3.5	\N	PENDIENTE	0	7	2
8	10	\N	PENDIENTE	0	15	2
1	12	15	RECIBIDA	0	4	1
3	27	20	PARCIAL	0	4	2
10	9	\N	PENDIENTE	0	6	3
11	100	\N	PENDIENTE	0	10	3
12	3.5	\N	PENDIENTE	0	7	3
13	10	\N	PENDIENTE	0	15	3
14	12	\N	PENDIENTE	0	5	4
15	9	\N	PENDIENTE	0	6	4
16	100	\N	PENDIENTE	0	10	4
17	3.5	\N	PENDIENTE	0	7	4
18	10	\N	PENDIENTE	0	15	4
19	12	\N	PENDIENTE	0	5	5
20	9	\N	PENDIENTE	0	6	5
21	100	\N	PENDIENTE	0	10	5
22	3.5	\N	PENDIENTE	0	7	5
23	10	\N	PENDIENTE	0	15	5
9	12	12	RECIBIDA	0	5	3
24	9	\N	PENDIENTE	0	6	6
25	100	\N	PENDIENTE	0	10	6
26	3.5	\N	PENDIENTE	0	7	6
27	10	\N	PENDIENTE	0	15	6
\.


--
-- Data for Name: prov_insumo; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.prov_insumo (id, fecha_actualizacion, precio_unitario, id_insumo, id_proveedor) FROM stdin;
3	2025-11-11 00:00:00	80	3	1
4	2025-11-11 00:00:00	60	4	5
5	2025-11-11 00:00:00	40	5	5
6	2025-11-11 00:00:00	30	6	5
7	2025-11-11 00:00:00	120	7	2
8	2025-11-11 00:00:00	90	8	3
9	2025-11-11 00:00:00	70	9	3
10	2025-11-11 00:00:00	15	10	1
11	2025-11-11 00:00:00	50	11	2
12	2025-11-11 00:00:00	180	12	3
13	2025-11-11 00:00:00	95	13	2
14	2025-11-11 00:00:00	600	14	1
15	2025-11-11 00:00:00	55	15	1
17	2025-11-11 01:01:22.069861	350	2	5
18	2025-11-11 02:10:40.758529	0	1	1
\.


--
-- Data for Name: proveedor; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.proveedor (id_proveedor, contacto, nombre, precio) FROM stdin;
1	central@proveedores.com	Proveedor Central	0
2	norte@distribuidora.com	Distribuidora Norte	0
3	sur@almacen.com	Almacén del Sur	0
4	info@carnespremium.com	Carnes Premium	0
5	ventas@verdurasfrescas.com	Verduras Frescas	0
\.


--
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.usuario (id_usuario, activo, fecha_creacion, nombre, password, rol, username) FROM stdin;
\.


--
-- Name: evento_extra_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.evento_extra_id_seq', 9, true);


--
-- Name: evento_id_evento_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.evento_id_evento_seq', 21, true);


--
-- Name: extra_id_extra_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.extra_id_extra_seq', 5, true);


--
-- Name: insumo_id_insumo_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.insumo_id_insumo_seq', 15, true);


--
-- Name: menu_id_menu_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.menu_id_menu_seq', 5, true);


--
-- Name: menu_insumo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.menu_insumo_id_seq', 42, true);


--
-- Name: orden_compra_detalle_id_oc_det_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.orden_compra_detalle_id_oc_det_seq', 27, true);


--
-- Name: orden_compra_id_oc_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.orden_compra_id_oc_seq', 6, true);


--
-- Name: prov_insumo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.prov_insumo_id_seq', 18, true);


--
-- Name: proveedor_id_proveedor_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.proveedor_id_proveedor_seq', 5, true);


--
-- Name: usuario_id_usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.usuario_id_usuario_seq', 1, false);


--
-- Name: evento_extra evento_extra_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evento_extra
    ADD CONSTRAINT evento_extra_pkey PRIMARY KEY (id);


--
-- Name: evento evento_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evento
    ADD CONSTRAINT evento_pkey PRIMARY KEY (id_evento);


--
-- Name: extra extra_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.extra
    ADD CONSTRAINT extra_pkey PRIMARY KEY (id_extra);


--
-- Name: insumo insumo_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.insumo
    ADD CONSTRAINT insumo_pkey PRIMARY KEY (id_insumo);


--
-- Name: menu_insumo menu_insumo_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu_insumo
    ADD CONSTRAINT menu_insumo_pkey PRIMARY KEY (id);


--
-- Name: menu menu_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu
    ADD CONSTRAINT menu_pkey PRIMARY KEY (id_menu);


--
-- Name: orden_compra_detalle orden_compra_detalle_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orden_compra_detalle
    ADD CONSTRAINT orden_compra_detalle_pkey PRIMARY KEY (id_oc_det);


--
-- Name: orden_compra orden_compra_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orden_compra
    ADD CONSTRAINT orden_compra_pkey PRIMARY KEY (id_oc);


--
-- Name: prov_insumo prov_insumo_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.prov_insumo
    ADD CONSTRAINT prov_insumo_pkey PRIMARY KEY (id);


--
-- Name: proveedor proveedor_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.proveedor
    ADD CONSTRAINT proveedor_pkey PRIMARY KEY (id_proveedor);


--
-- Name: usuario uk_863n1y3x0jalatoir4325ehal; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT uk_863n1y3x0jalatoir4325ehal UNIQUE (username);


--
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id_usuario);


--
-- Name: orden_compra_detalle fk1lg1lk51ugncl3ysqg8wh7ege; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orden_compra_detalle
    ADD CONSTRAINT fk1lg1lk51ugncl3ysqg8wh7ege FOREIGN KEY (id_insumo) REFERENCES public.insumo(id_insumo);


--
-- Name: orden_compra_detalle fk1sflux105nsm1mnk147g711nm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orden_compra_detalle
    ADD CONSTRAINT fk1sflux105nsm1mnk147g711nm FOREIGN KEY (id_oc) REFERENCES public.orden_compra(id_oc);


--
-- Name: orden_compra fk5c6m350aqy0wu4nfjm3ry211u; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orden_compra
    ADD CONSTRAINT fk5c6m350aqy0wu4nfjm3ry211u FOREIGN KEY (id_evento) REFERENCES public.evento(id_evento);


--
-- Name: prov_insumo fk5qqmj6ud2tsd4rn0vm4n5ggq5; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.prov_insumo
    ADD CONSTRAINT fk5qqmj6ud2tsd4rn0vm4n5ggq5 FOREIGN KEY (id_proveedor) REFERENCES public.proveedor(id_proveedor);


--
-- Name: evento fk69k6h2afbe7k2y3fibsqocqs; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evento
    ADD CONSTRAINT fk69k6h2afbe7k2y3fibsqocqs FOREIGN KEY (id_menu) REFERENCES public.menu(id_menu);


--
-- Name: menu_insumo fkc9g6pmk9wc9enynvd51f0q38h; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu_insumo
    ADD CONSTRAINT fkc9g6pmk9wc9enynvd51f0q38h FOREIGN KEY (id_menu) REFERENCES public.menu(id_menu);


--
-- Name: menu_insumo fkd5bnuk5oatvk7golwgrm96c3s; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu_insumo
    ADD CONSTRAINT fkd5bnuk5oatvk7golwgrm96c3s FOREIGN KEY (id_insumo) REFERENCES public.insumo(id_insumo);


--
-- Name: prov_insumo fkfmyctv7734tvuix4mgwgwslg1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.prov_insumo
    ADD CONSTRAINT fkfmyctv7734tvuix4mgwgwslg1 FOREIGN KEY (id_insumo) REFERENCES public.insumo(id_insumo);


--
-- Name: evento_extra fkjrorm5d4yj3jve596fvbdct3n; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evento_extra
    ADD CONSTRAINT fkjrorm5d4yj3jve596fvbdct3n FOREIGN KEY (id_evento) REFERENCES public.evento(id_evento);


--
-- Name: orden_compra fkpgp1ooe3wmycq29kdj6qydybp; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orden_compra
    ADD CONSTRAINT fkpgp1ooe3wmycq29kdj6qydybp FOREIGN KEY (id_proveedor) REFERENCES public.proveedor(id_proveedor);


--
-- Name: evento_extra fkpher8dvl3weymdaop9eoqv88b; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evento_extra
    ADD CONSTRAINT fkpher8dvl3weymdaop9eoqv88b FOREIGN KEY (id_extra) REFERENCES public.extra(id_extra);


--
-- PostgreSQL database dump complete
--


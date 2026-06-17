--
-- PostgreSQL database dump
--

\restrict NQ3BUfcHI5dWdUyVHcf2RxUSW1IaP9MDCggCQ88FVOHylGxqwHs9S9zT8iGwGb4

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._user (
    id_user bigint NOT NULL,
    slug character varying(50) NOT NULL,
    role character varying(50) DEFAULT 'User'::character varying,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    biography text,
    user_image text DEFAULT 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png'::text,
    provider character varying(255) NOT NULL,
    CONSTRAINT _user_provider_check CHECK (((provider)::text = ANY ((ARRAY['LOCAL'::character varying, 'GOOGLE'::character varying])::text[])))
);


ALTER TABLE public._user OWNER TO postgres;

--
-- Name: _user_id_user_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public._user_id_user_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public._user_id_user_seq OWNER TO postgres;

--
-- Name: _user_id_user_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public._user_id_user_seq OWNED BY public._user.id_user;


--
-- Name: comment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comment (
    id_comment bigint NOT NULL,
    user_id bigint NOT NULL,
    dish_id bigint NOT NULL,
    message text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.comment OWNER TO postgres;

--
-- Name: comment_id_comment_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comment_id_comment_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comment_id_comment_seq OWNER TO postgres;

--
-- Name: comment_id_comment_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comment_id_comment_seq OWNED BY public.comment.id_comment;


--
-- Name: country; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.country (
    id_country bigint NOT NULL,
    country_name character varying(100) NOT NULL
);


ALTER TABLE public.country OWNER TO postgres;

--
-- Name: country_id_country_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.country_id_country_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.country_id_country_seq OWNER TO postgres;

--
-- Name: country_id_country_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.country_id_country_seq OWNED BY public.country.id_country;


--
-- Name: dish; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dish (
    id_dish bigint NOT NULL,
    dish_name character varying(100) NOT NULL,
    cooking_time integer NOT NULL,
    cost integer NOT NULL,
    ease character varying(10) NOT NULL,
    list_images character varying(250)[] DEFAULT '{}'::character varying[] NOT NULL,
    dish_type character varying(50) NOT NULL,
    diets character varying(50)[] DEFAULT '{}'::character varying[] NOT NULL,
    id_country bigint NOT NULL,
    creator_user_id bigint DEFAULT 1 NOT NULL,
    slug character varying(50) NOT NULL,
    persons integer CONSTRAINT dish_personnes_not_null NOT NULL
);


ALTER TABLE public.dish OWNER TO postgres;

--
-- Name: dish_id_dish_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dish_id_dish_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dish_id_dish_seq OWNER TO postgres;

--
-- Name: dish_id_dish_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dish_id_dish_seq OWNED BY public.dish.id_dish;


--
-- Name: dish_ingredient; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dish_ingredient (
    id_dish_ingredient integer NOT NULL,
    dish_id bigint,
    ingredient_id bigint,
    quantity numeric(6,2),
    unit character varying(20)
);


ALTER TABLE public.dish_ingredient OWNER TO postgres;

--
-- Name: dish_ingredient_id_dish_ingredient_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dish_ingredient_id_dish_ingredient_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dish_ingredient_id_dish_ingredient_seq OWNER TO postgres;

--
-- Name: dish_ingredient_id_dish_ingredient_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dish_ingredient_id_dish_ingredient_seq OWNED BY public.dish_ingredient.id_dish_ingredient;


--
-- Name: dish_recipe_steps; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dish_recipe_steps (
    dish_id bigint NOT NULL,
    step text NOT NULL,
    step_order integer NOT NULL
);


ALTER TABLE public.dish_recipe_steps OWNER TO postgres;

--
-- Name: dish_tool; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dish_tool (
    id_dish_tool bigint NOT NULL,
    dish_id bigint,
    tool_id bigint
);


ALTER TABLE public.dish_tool OWNER TO postgres;

--
-- Name: dish_tool_id_dish_tool_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dish_tool_id_dish_tool_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dish_tool_id_dish_tool_seq OWNER TO postgres;

--
-- Name: dish_tool_id_dish_tool_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dish_tool_id_dish_tool_seq OWNED BY public.dish_tool.id_dish_tool;


--
-- Name: ingredient; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ingredient (
    id_ingredient bigint NOT NULL,
    ingredient_name character varying(50) NOT NULL
);


ALTER TABLE public.ingredient OWNER TO postgres;

--
-- Name: ingredient_id_ingredient_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ingredient_id_ingredient_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ingredient_id_ingredient_seq OWNER TO postgres;

--
-- Name: ingredient_id_ingredient_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ingredient_id_ingredient_seq OWNED BY public.ingredient.id_ingredient;


--
-- Name: like_dish; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.like_dish (
    id_like bigint NOT NULL,
    user_id bigint NOT NULL,
    dish_id bigint NOT NULL
);


ALTER TABLE public.like_dish OWNER TO postgres;

--
-- Name: like_dish_id_like_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.like_dish_id_like_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.like_dish_id_like_seq OWNER TO postgres;

--
-- Name: like_dish_id_like_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.like_dish_id_like_seq OWNED BY public.like_dish.id_like;


--
-- Name: rating; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rating (
    id_rating bigint NOT NULL,
    user_id bigint NOT NULL,
    dish_id bigint NOT NULL,
    stars integer NOT NULL,
    CONSTRAINT rating_stars_check CHECK ((((stars)::numeric >= (1)::numeric) AND ((stars)::numeric <= (5)::numeric)))
);


ALTER TABLE public.rating OWNER TO postgres;

--
-- Name: rating_id_rating_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rating_id_rating_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rating_id_rating_seq OWNER TO postgres;

--
-- Name: rating_id_rating_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rating_id_rating_seq OWNED BY public.rating.id_rating;


--
-- Name: tool; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tool (
    id_tool bigint NOT NULL,
    tool_name character varying(50) NOT NULL
);


ALTER TABLE public.tool OWNER TO postgres;

--
-- Name: tool_id_tool_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tool_id_tool_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tool_id_tool_seq OWNER TO postgres;

--
-- Name: tool_id_tool_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tool_id_tool_seq OWNED BY public.tool.id_tool;


--
-- Name: _user id_user; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._user ALTER COLUMN id_user SET DEFAULT nextval('public._user_id_user_seq'::regclass);


--
-- Name: comment id_comment; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment ALTER COLUMN id_comment SET DEFAULT nextval('public.comment_id_comment_seq'::regclass);


--
-- Name: country id_country; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.country ALTER COLUMN id_country SET DEFAULT nextval('public.country_id_country_seq'::regclass);


--
-- Name: dish id_dish; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dish ALTER COLUMN id_dish SET DEFAULT nextval('public.dish_id_dish_seq'::regclass);


--
-- Name: dish_ingredient id_dish_ingredient; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dish_ingredient ALTER COLUMN id_dish_ingredient SET DEFAULT nextval('public.dish_ingredient_id_dish_ingredient_seq'::regclass);


--
-- Name: dish_tool id_dish_tool; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dish_tool ALTER COLUMN id_dish_tool SET DEFAULT nextval('public.dish_tool_id_dish_tool_seq'::regclass);


--
-- Name: ingredient id_ingredient; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredient ALTER COLUMN id_ingredient SET DEFAULT nextval('public.ingredient_id_ingredient_seq'::regclass);


--
-- Name: like_dish id_like; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.like_dish ALTER COLUMN id_like SET DEFAULT nextval('public.like_dish_id_like_seq'::regclass);


--
-- Name: rating id_rating; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rating ALTER COLUMN id_rating SET DEFAULT nextval('public.rating_id_rating_seq'::regclass);


--
-- Name: tool id_tool; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tool ALTER COLUMN id_tool SET DEFAULT nextval('public.tool_id_tool_seq'::regclass);


--
-- Data for Name: _user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._user (id_user, slug, role, username, email, password, biography, user_image, provider) FROM stdin;
4	auth	AuthService	auth	auth@example.com	$2a$10$hmCjswr29yTGEgqfnPx5FOheX/xprNo3569byvBGMTGxOxnFCh4wW	Authentication service account. Used for managing authentication and authorization in the application.	\N	LOCAL
6	exemple	User	Exemple	Exemple@gmail.com	$2a$10$2dw7yJ261D2lIfi3EBpRLO3KQX9u0d70kcY1G7JUK9Su7pkZWv.oi	Test biography	\N	LOCAL
1	ssmith	User	ssmith	ssmith@gmail.com	$2a$10$PoPtt3EYLx3lifFpn7VgEuLgSxNPoLgDkpq6EfM/ikmkcuv2EaM0q	Passionate italian home cook and food lover. Sharing my culinary adventures and recipes from around the world.	https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Flag_of_Italy.svg/1280px-Flag_of_Italy.svg.png	LOCAL
7	testdeconnection	User	testDeconnection	testd@gmail.com	$2a$10$OjSm2fsh9mChQwnV3xH5j.WDa.8z4im5nCnWvc7uqfl6CZ81kFCAe	\N	\N	LOCAL
8	testd	User	TestD	testd2@gmail.com	$2a$10$YbdBQV0ruEzZ1LbtRxARQe0inbI.vkAyuQEzDRu5.pcxmu/WD3YT.	\N	\N	LOCAL
3	accoow	Admin	accoow	accoow@gmail.com	$2a$10$0D.Sp6rw6L8EHEGT0Bl/VOnuulQOerHAG0s.sFc.8noHMV2adTjby	Chef and food blogger. Sharing my culinary creations and recipes inspired by world flavors.	\N	LOCAL
2	xelea	User	xelea	xelea@gmail.com	$2a$10$6OLRhul3DUZg.Wp8Ugbt0eUHOQStmlhM7Sv4zSktxtdPofIl8pqKu	Food enthusiast and recipe creator. Exploring global cuisines and sharing delicious recipes with	\N	LOCAL
\.


--
-- Data for Name: comment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comment (id_comment, user_id, dish_id, message, created_at) FROM stdin;
2	2	1	C'est la vraie recette de ma grand-mère. Très réconfortante en hiver.	2026-06-11 19:44:38.739699
1	1	1	Édition : J'ai refait cette soupe ce soir, et en ajoutant un peu de muscade c'est encore meilleur !	2026-06-11 19:44:38.739699
4	1	1	Merci pour cette recette encore	2026-06-14 19:50:52.882028
5	1	1	Merci pour tout 	2026-06-14 19:56:20.402773
6	8	3	Recette délicieuse	2026-06-15 15:45:37.163487
\.


--
-- Data for Name: country; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.country (id_country, country_name) FROM stdin;
1	Albanie
2	Allemagne
3	Andorre
4	Autriche
5	Belgique
6	Biélorussie
7	Bosnie-Herzégovine
8	Bulgarie
9	Chypre
10	Croatie
11	Danemark
12	Espagne
13	Estonie
14	Finlande
15	France
16	Grèce
17	Hongrie
18	Irlande
19	Islande
20	Italie
21	Lettonie
22	Liechtenstein
23	Lituanie
24	Luxembourg
25	Macédoine du Nord
26	Malte
27	Moldavie
28	Monaco
29	Monténégro
30	Norvège
31	Pays-Bas
32	Pologne
33	Portugal
34	Roumanie
35	Royaume-Uni
36	Russie
37	Saint-Marin
38	Serbie
39	Slovaquie
40	Slovénie
41	Suède
42	Suisse
43	Tchéquie
44	Ukraine
45	Vatican
46	Antigua-et-Barbuda
47	Argentine
48	Bahamas
49	Barbade
50	Belize
51	Bolivie
52	Brésil
53	Canada
54	Chili
55	Colombie
56	Costa Rica
57	Cuba
58	Dominique
59	Équateur
60	États-Unis
61	Grenade
62	Guatemala
63	Guyana
64	Haïti
65	Honduras
66	Jamaïque
67	Mexique
68	Nicaragua
69	Panama
70	Paraguay
71	Pérou
72	République Dominicaine
73	Saint-Christophe-et-Niévès
74	Sainte-Lucie
75	Saint-Vincent-et-les-Grenadines
76	Salvador
77	Suriname
78	Trinité-et-Tobago
79	Uruguay
80	Venezuela
81	Afrique du Sud
82	Algérie
83	Angola
84	Bénin
85	Botswana
86	Burkina Faso
87	Burundi
88	Cameroun
89	Cap-Vert
90	Comores
91	Congo-Brazzaville
92	Congo-Kinshasa (RDC)
93	Côte d'Ivoire
94	Djibouti
95	Égypte
96	Érythrée
97	Eswatini (Swaziland)
98	Éthiopie
99	Gabon
100	Gambie
101	Ghana
102	Guinée
103	Guinée-Bissau
104	Guinée équatoriale
105	Kenya
106	Lesotho
107	Liberia
108	Libye
109	Madagascar
110	Malawi
111	Mali
112	Maroc
113	Maurice
114	Mauritanie
115	Mozambique
116	Namibie
117	Niger
118	Nigeria
119	Ouganda
120	République centrafricaine
121	Rwanda
122	Sao Tomé-et-Principe
123	Sénégal
124	Seychelles
125	Sierra Leone
126	Somalie
127	Soudan
128	Soudan du Sud
129	Tanzanie
130	Tchad
131	Togo
132	Tunisie
133	Zambie
134	Zimbabwe
135	Afghanistan
136	Arabie Saoudite
137	Arménie
138	Azerbaïdjan
139	Bahreïn
140	Bangladesh
141	Bhoutan
142	Brunei
143	Cambodge
144	Chine
145	Corée du Nord
146	Corée du Sud
147	Émirats Arabes Unis
148	Géorgie
149	Inde
150	Indonésie
151	Irak
152	Iran
153	Israël
154	Japon
155	Jordanie
156	Kazakhstan
157	Kirghizistan
158	Koweït
159	Laos
160	Liban
161	Malaisie
162	Maldives
163	Birmanie (Myanmar)
164	Népal
165	Oman
166	Ouzbékistan
167	Pakistan
168	Palestine
169	Philippines
170	Qatar
171	Singapour
172	Sri Lanka
173	Syrie
174	Tadjikistan
175	Taïwan
176	Thaïlande
177	Timor oriental
178	Turquie
179	Turkménistan
180	Viêt Nam
181	Yémen
182	Australie
183	Fidji
184	Kiribati
185	Îles Marshall
186	Micronésie
187	Nauru
188	Nouvelle-Zélande
189	Palaos
190	Papouasie-Nouvelle-Guinée
191	Salomon
192	Samoa
193	Tonga
194	Tuvalu
195	Vanuatu
\.


--
-- Data for Name: dish; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dish (id_dish, dish_name, cooking_time, cost, ease, list_images, dish_type, diets, id_country, creator_user_id, slug, persons) FROM stdin;
1	Soupe à l'oignon gratinée	60	6	MOYEN	{https://assets.afcdn.com/recipe/20181012/82641_w1024h576c1cx2136cy1424cxt0cyt0cxb4272cyb2848.jpg,https://brasseriemadeleine-orleans.fr/wp-content/uploads/2024/06/soupe-oignon-gratinee-delicieuse-et-reconfortante.webp}	PLAT	{VEGETARIEN}	15	3	soupe-a-l-oignon-gratinee	4
3	Guacamole	0	7	FACILE	{https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480_1_5x/img/recipe/ras/Assets/7DD941F0-7E17-4DBB-A778-90328C0AC000/Derivates/254D6349-1A37-47B1-A490-BC4B5013AECA.jpg,https://whatmollymade.com/wp-content/uploads/2024/05/homemade-guacamole-1.jpg,https://www.giallozafferano.fr/images/9-974/Guacamole_1200x800.jpg,https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1OwqemFFM2gO1rAxCZhFaSeI0exXYTXLb8g&s}	BOISSON	{VEGETARIEN,VEGAN,SANS_GLUTEN,HALAL,SANS_LACTOSE}	67	1	guacamole	4
5	Spaghetti Express	15	2	FACILE	{https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8}	PLAT	{AUCUN}	20	1	spaghetti-express	2
6	Mochi	45	1	MOYEN	{https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJzlQu5690hezYGf6eEvcqPxvtQcqJAnYH84yjGlfPVqhkhCDidXCd0T4B&s=10,https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKzFvvn0m6-Fc4KL83MflXMFDMRILSmK2Zdwl845R4ANGw_LTrCUiJ-Gw&s=10,https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkUoS_jTTiHwyfAieomste1yc2q9Qd1XFjF8unT4z98eRDA9--j7gzK2o&s=10}	DESSERT	{VEGAN,VEGETARIEN,SANS_GLUTEN,SANS_LACTOSE,HALAL}	154	1	mochi	4
7	Tortilla Española	40	2	MOYEN	{https://www.goya.com/wp-content/uploads/2023/10/tortilla-espan-ola-potato-omelet.jpg,https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyzi4BJsa5Gn9-TyaQW30BIbbO1quy6lscDOjk8PpqtQ&s=10,https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIkvo-Z5BQgu1-GeUv2ZUF6RtYzoxMwemNWkEy_GyhoPLJ87wC8_T1Ifo&s=10,https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR3FdS_eKa5NN-5ufYG5kbStagoN7Gw6hV2q16Wpp5gHi7wYEFQ8b3X4o&s=10}	PLAT	{VEGETARIEN,SANS_GLUTEN,SANS_LACTOSE,HALAL}	12	1	tortilla-espanola	4
8	Baklava	75	3	DIFFICILE	{https://upload.wikimedia.org/wikipedia/commons/c/c7/Baklava%281%29.png,https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0NA0TN7uPHU-veOZZEOTBysejzHawpc6vfGmdzenU5w1AFnRwPH-Xr6E&s=10}	DESSERT	{VEGETARIEN,HALAL}	16	1	baklava	8
\.


--
-- Data for Name: dish_ingredient; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dish_ingredient (id_dish_ingredient, dish_id, ingredient_id, quantity, unit) FROM stdin;
1	1	1	1000.00	g
2	1	69	50.00	g
3	1	94	20.00	g
4	1	92	150.00	ml
5	1	90	2.00	pièce
6	1	102	4.00	tranche
7	1	78	150.00	g
58	3	109	3.00	Unité
59	3	1	0.50	Unité
60	3	5	2.00	Unité
61	3	65	2.00	g
62	3	105	30.00	ml
63	3	57	15.00	g
64	3	53	5.00	g
66	5	45	200.00	g
67	6	91	100.00	g
68	6	92	50.00	g
69	7	12	600.00	g
70	7	1	1.00	u
71	7	75	6.00	u
72	7	83	150.00	ml
73	7	52	1.00	pincée
74	8	91	250.00	g
75	8	67	150.00	g
76	8	65	1.00	cuillère à café
77	8	92	100.00	g
78	8	94	150.00	g
79	8	97	1.00	u
\.


--
-- Data for Name: dish_recipe_steps; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dish_recipe_steps (dish_id, step, step_order) FROM stdin;
1	Éplucher et émincer finement les oignons avec le couteau.	0
1	Dans une marmite, faire fondre le beurre et ajouter les oignons.	1
1	Laisser cuire à feu doux pendant 20 minutes en remuant jusqu'à ce qu'ils soient bien dorés et confits.	2
1	Saupoudrer de farine (singer) et remuer pendant 1 minute.	3
1	Déglacer avec le vin blanc puis ajouter 1,5 litre d'eau et le cube de bouillon de bœuf.	4
1	Laisser mijoter à couvert pendant 30 minutes.	5
1	Préchauffer le four en mode grill. Répartir la soupe dans des bols allant au four.	6
1	Déposer des tranches de pain de campagne sur le dessus et recouvrir généreusement de Comté râpé.	7
1	Passer au four sous le grill pendant 5 à 10 minutes jusqu'à ce que ce soit bien gratiné et doré.	8
3	Coupez les avocats en deux, retirez le noyau et récupérez la chair. Placez-la dans le bol ou le molcajete (mortier) et écrasez-la grossièrement à l'aide d'une fourchette ou d'un pilon.	0
3	Hachez finement l'oignon blanc et les tomates.	1
3	Incorporez les légumes hachés et le piment à l'avocat écrasé. Ajoutez le jus de citron vert frais et mélangez délicatement.	2
3	Ajoutez la coriandre fraîche hachée et le sel. Mélangez à nouveau pour bien répartir les saveurs.	3
3	Goûtez et rectifiez l'assaisonnement si nécessaire. Servez immédiatement avec des chips de maïs (tortilla chips).	4
5	Faire bouillir l'eau.	0
5	Cuire les pâtes 9 minutes.	1
5	Servir avec un filet d'huile d'olive.	2
6	Mélangez de la farine de riz gluant (shiratamako) avec de l’eau et du sucre.	0
6	Faites cuire le mélange à la vapeur ou au micro-ondes jusqu’à ce qu’il devienne collant et translucide.	1
6	Saupoudrez une surface avec de la fécule de maïs et pétrissez brièvement la pâte.	2
6	Couper en petits morceaux et façonner en boules.	3
6	Dégustez nature ou fourré à la pâte de haricots sucrée.	4
7	Épluchez et coupez les pommes de terre et les oignons en rondelles.	0
7	Faites-les frire lentement dans de l'huile d'olive jusqu'à ce qu'ils soient tendres mais pas dorés.	1
7	Battez les œufs dans un grand saladier et incorporez les pommes de terre et les oignons égouttés.	2
7	Versez le tout dans une poêle avec un peu d'huile et faites cuire à feu doux.	3
7	Retournez la tortilla à l'aide d'une assiette et faites cuire l'autre face jusqu'à ce qu'elle soit prise.	4
8	Superposez plusieurs feuilles de pâte phyllo en badigeonnant chacune de beurre fondu.	0
8	Répartissez une couche épaisse de noix hachées, de sucre et de cannelle.	1
8	Répétez l'opération en alternant les couches de pâte phyllo et de noix.	2
8	Coupez la pâte en losanges avant de la faire cuire au four jusqu'à ce qu'elle soit croustillante.	3
8	Versez le sirop de miel froid sur la pâtisserie chaude et laissez imbiber toute la nuit.	4
\.


--
-- Data for Name: dish_tool; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dish_tool (id_dish_tool, dish_id, tool_id) FROM stdin;
1	1	7
2	1	16
3	1	42
26	3	8
27	3	11
28	3	29
30	5	14
31	6	22
32	6	2
33	6	31
34	6	43
35	7	14
36	7	22
37	7	7
38	8	35
39	8	28
40	8	37
41	8	15
42	8	7
43	8	42
\.


--
-- Data for Name: ingredient; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ingredient (id_ingredient, ingredient_name) FROM stdin;
1	Oignon jaune
2	Oignon rouge
3	Ail
4	Échalote
5	Tomate
6	Courgette
7	Aubergine
8	Poivron rouge
9	Poivron vert
10	Carotte
11	Poireau
12	Pomme de terre
13	Navet
14	Céleri-branche
15	Épinard fresh
16	Laitue / Salade
17	Chou blanc
18	Chou-fleur
19	Brocoli
20	Haricot vert
21	Petit pois
22	Champignon de Paris
23	Bambou (pousses)
24	Blanc de poulet
25	Cuisse de poulet
26	Viande de Bœuf hachée
27	Steak de Bœuf
28	Côte de Porc
29	Lardon de porc
30	Gigot d'Agneau
31	Canard (magret)
32	Saucisse de Toulouse
33	Chorizo
34	Pavé de Saumon
35	Filet de Cabillaud
36	Thon en boîte
37	Crevette décortiquée
38	Gambas
39	Moule fresh
40	Calamar / Poulpe
41	Anchois
42	Riz Blanc basmati
43	Riz Rond à Sushi
44	Pâtes Spaghetti
45	Pâtes Penne
46	Nouilles Udon / Ramen
47	Semoule de Couscous
48	Quinoa
49	Lentilles vertes
50	Lentilles corail
51	Pois chiches
52	Haricots rouges
53	Sel
54	Poivre noir
55	Persil fresh
56	Basilic fresh
57	Coriandre fresh
58	Menthe fresh
59	Thym sésame
60	Laurier (feuille)
61	Cumin en poudre
62	Paprika doux
63	Curry en poudre
64	Gingembre fresh
65	Piment en poudre
66	Cannelle en poudre
67	Noix de muscade
68	Safran
69	Beurre
70	Crème fraîche liquide
71	Lait demi-écrémé
72	Lait de coco
73	Œuf
74	Fromage Gruyère râpé
75	Fromage Parmesan (Parmigiano)
76	Fromage Mozzarella
77	Fromage de Chèvre
78	Fromage Comté AOP
79	Feta
80	Tofu ferme
81	Huile d'olive
82	Huile de tournesol
83	Huile de sésame
84	Sauce Tomate cuisinée
85	Concentré de tomate
86	Sauce soja salée
87	Sauce soja sucrée
88	Vinaigre de vin blanc
89	Vinaigre balsamique
90	Bouillon de Bœuf (cube)
91	Bouillon de Volaille (cube)
92	Vin blanc de cuisine
93	Vin rouge de cuisine
94	Farine de blé T55
95	Sucre blanc en poudre
96	Sucre roux / Cassonade
97	Miel liquide
98	Levure chimique
99	Levure boulangère sèche
100	Chocolat noir pâtissier
101	Extrait de vanille liquide
102	Pain de campagne rassis
103	Chapelure
104	Citron jaune
105	Citron vert / Lime
106	Pomme
107	Banane
108	Orange
109	Avocat
110	Noix de cajou
111	Amandes effilées
112	Pignons de pin
\.


--
-- Data for Name: like_dish; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.like_dish (id_like, user_id, dish_id) FROM stdin;
14	1	1
16	1	3
19	2	8
20	2	6
21	2	3
\.


--
-- Data for Name: rating; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rating (id_rating, user_id, dish_id, stars) FROM stdin;
2	2	1	5
43	3	1	5
1	1	1	3
47	8	3	3
46	1	3	4
49	1	7	3
50	1	8	5
51	1	6	5
52	1	5	1
53	2	3	4
54	2	5	2
55	2	6	4
56	2	7	3
57	2	8	5
\.


--
-- Data for Name: tool; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tool (id_tool, tool_name) FROM stdin;
1	Cuillère en bois
2	Spatule / Marise
3	Fouet de cuisine
4	Louche
5	Pince de cuisine
6	Écumoire
7	Couteau de chef
8	Couteau d'office
9	Couteau à pain
10	Éplucheur / Économe
11	Planche à découper
12	Rape à fromage / Zesteur
13	Mandoline
14	Poêle antiadhésive
15	Casserole
16	Marmite / Faitout
17	Wok
18	Plat à gratin / Plat allant au four
19	Poêle en fonte
20	Cocotte en fonte
21	Passoire
22	Cul de poule / Saladier
23	Verre doseur
24	Balance de cuisine
25	Presse-ail
26	Presse-agrume
27	Ouvre-boîte
28	Pinceau de cuisine
29	Mortier et pilon
30	Presse-purée
31	Rouleau à pâtisserie
32	Moule à gâteau
33	Poche à douille
34	Tamis
35	Plaque de cuisson / Tapis en silicone
36	Mixeur plongeant
37	Blender
38	Robot pâtissier / Batteur électrique
39	Grille-pain
40	Balance électronique
41	Batteur électrique
42	Four
43	Plaque de cuisson (Induction/Gaz)
44	Micro-ondes
45	Friteuse
\.


--
-- Name: _user_id_user_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public._user_id_user_seq', 8, true);


--
-- Name: comment_id_comment_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comment_id_comment_seq', 7, true);


--
-- Name: country_id_country_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.country_id_country_seq', 195, true);


--
-- Name: dish_id_dish_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.dish_id_dish_seq', 8, true);


--
-- Name: dish_ingredient_id_dish_ingredient_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.dish_ingredient_id_dish_ingredient_seq', 79, true);


--
-- Name: dish_tool_id_dish_tool_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.dish_tool_id_dish_tool_seq', 43, true);


--
-- Name: ingredient_id_ingredient_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ingredient_id_ingredient_seq', 112, true);


--
-- Name: like_dish_id_like_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.like_dish_id_like_seq', 21, true);


--
-- Name: rating_id_rating_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rating_id_rating_seq', 57, true);


--
-- Name: tool_id_tool_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tool_id_tool_seq', 45, true);


--
-- Name: _user _user_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._user
    ADD CONSTRAINT _user_email_key UNIQUE (email);


--
-- Name: _user _user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._user
    ADD CONSTRAINT _user_pkey PRIMARY KEY (id_user);


--
-- Name: _user _user_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._user
    ADD CONSTRAINT _user_slug_key UNIQUE (slug);


--
-- Name: _user _user_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._user
    ADD CONSTRAINT _user_username_key UNIQUE (username);


--
-- Name: comment comment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT comment_pkey PRIMARY KEY (id_comment);


--
-- Name: country country_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.country
    ADD CONSTRAINT country_pkey PRIMARY KEY (id_country);


--
-- Name: dish_ingredient dish_ingredient_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dish_ingredient
    ADD CONSTRAINT dish_ingredient_pkey PRIMARY KEY (id_dish_ingredient);


--
-- Name: dish dish_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dish
    ADD CONSTRAINT dish_pkey PRIMARY KEY (id_dish);


--
-- Name: dish_recipe_steps dish_recipe_steps_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dish_recipe_steps
    ADD CONSTRAINT dish_recipe_steps_pkey PRIMARY KEY (dish_id, step_order);


--
-- Name: dish_tool dish_tool_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dish_tool
    ADD CONSTRAINT dish_tool_pkey PRIMARY KEY (id_dish_tool);


--
-- Name: ingredient ingredient_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredient
    ADD CONSTRAINT ingredient_pkey PRIMARY KEY (id_ingredient);


--
-- Name: like_dish like_dish_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.like_dish
    ADD CONSTRAINT like_dish_pkey PRIMARY KEY (id_like);


--
-- Name: like_dish like_dish_user_id_dish_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.like_dish
    ADD CONSTRAINT like_dish_user_id_dish_id_key UNIQUE (user_id, dish_id);


--
-- Name: rating rating_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rating
    ADD CONSTRAINT rating_pkey PRIMARY KEY (id_rating);


--
-- Name: rating rating_user_id_dish_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rating
    ADD CONSTRAINT rating_user_id_dish_id_key UNIQUE (user_id, dish_id);


--
-- Name: tool tool_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tool
    ADD CONSTRAINT tool_pkey PRIMARY KEY (id_tool);


--
-- Name: comment comment_dish_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT comment_dish_id_fkey FOREIGN KEY (dish_id) REFERENCES public.dish(id_dish) ON DELETE CASCADE;


--
-- Name: comment comment_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT comment_user_id_fkey FOREIGN KEY (user_id) REFERENCES public._user(id_user);


--
-- Name: dish dish_creator_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dish
    ADD CONSTRAINT dish_creator_user_id_fkey FOREIGN KEY (creator_user_id) REFERENCES public._user(id_user) ON DELETE SET DEFAULT;


--
-- Name: dish dish_id_country_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dish
    ADD CONSTRAINT dish_id_country_fkey FOREIGN KEY (id_country) REFERENCES public.country(id_country);


--
-- Name: dish_ingredient dish_ingredient_dish_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dish_ingredient
    ADD CONSTRAINT dish_ingredient_dish_id_fkey FOREIGN KEY (dish_id) REFERENCES public.dish(id_dish) ON DELETE CASCADE;


--
-- Name: dish_ingredient dish_ingredient_ingredient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dish_ingredient
    ADD CONSTRAINT dish_ingredient_ingredient_id_fkey FOREIGN KEY (ingredient_id) REFERENCES public.ingredient(id_ingredient) ON DELETE CASCADE;


--
-- Name: dish_recipe_steps dish_recipe_steps_dish_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dish_recipe_steps
    ADD CONSTRAINT dish_recipe_steps_dish_id_fkey FOREIGN KEY (dish_id) REFERENCES public.dish(id_dish) ON DELETE CASCADE;


--
-- Name: dish_tool dish_tool_dish_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dish_tool
    ADD CONSTRAINT dish_tool_dish_id_fkey FOREIGN KEY (dish_id) REFERENCES public.dish(id_dish) ON DELETE CASCADE;


--
-- Name: dish_tool dish_tool_tool_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dish_tool
    ADD CONSTRAINT dish_tool_tool_id_fkey FOREIGN KEY (tool_id) REFERENCES public.tool(id_tool) ON DELETE CASCADE;


--
-- Name: like_dish like_dish_dish_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.like_dish
    ADD CONSTRAINT like_dish_dish_id_fkey FOREIGN KEY (dish_id) REFERENCES public.dish(id_dish) ON DELETE CASCADE;


--
-- Name: like_dish like_dish_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.like_dish
    ADD CONSTRAINT like_dish_user_id_fkey FOREIGN KEY (user_id) REFERENCES public._user(id_user);


--
-- Name: rating rating_dish_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rating
    ADD CONSTRAINT rating_dish_id_fkey FOREIGN KEY (dish_id) REFERENCES public.dish(id_dish) ON DELETE CASCADE;


--
-- Name: rating rating_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rating
    ADD CONSTRAINT rating_user_id_fkey FOREIGN KEY (user_id) REFERENCES public._user(id_user);


--
-- PostgreSQL database dump complete
--

\unrestrict NQ3BUfcHI5dWdUyVHcf2RxUSW1IaP9MDCggCQ88FVOHylGxqwHs9S9zT8iGwGb4


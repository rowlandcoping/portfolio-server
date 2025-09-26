--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5 (Ubuntu 17.5-1.pgdg22.04+1)
-- Dumped by pg_dump version 17.5 (Ubuntu 17.5-1.pgdg22.04+1)

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

SET default_tablespace = '';

--
-- Name: About; Type: TABLE; Schema: public; Owner: cookeryc
--

CREATE TABLE public."About" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    overview text NOT NULL,
    "typeId" integer NOT NULL,
    repo text NOT NULL,
    "copyName" text NOT NULL,
    "copyYear" integer NOT NULL
);


ALTER TABLE public."About" OWNER TO cookeryc;

--
-- Name: About_id_seq; Type: SEQUENCE; Schema: public; Owner: cookeryc
--

CREATE SEQUENCE public."About_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."About_id_seq" OWNER TO cookeryc;

--
-- Name: About_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cookeryc
--

ALTER SEQUENCE public."About_id_seq" OWNED BY public."About".id;


--
-- Name: Contact; Type: TABLE; Schema: public; Owner: cookeryc
--

CREATE TABLE public."Contact" (
    id integer NOT NULL,
    email text NOT NULL,
    name text NOT NULL,
    "projectId" integer,
    message text NOT NULL,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    "personId" integer
);


ALTER TABLE public."Contact" OWNER TO cookeryc;

--
-- Name: Contact_id_seq; Type: SEQUENCE; Schema: public; Owner: cookeryc
--

CREATE SEQUENCE public."Contact_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Contact_id_seq" OWNER TO cookeryc;

--
-- Name: Contact_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cookeryc
--

ALTER SEQUENCE public."Contact_id_seq" OWNED BY public."Contact".id;


--
-- Name: EcoType; Type: TABLE; Schema: public; Owner: cookeryc
--

CREATE TABLE public."EcoType" (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."EcoType" OWNER TO cookeryc;

--
-- Name: EcoType_id_seq; Type: SEQUENCE; Schema: public; Owner: cookeryc
--

CREATE SEQUENCE public."EcoType_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."EcoType_id_seq" OWNER TO cookeryc;

--
-- Name: EcoType_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cookeryc
--

ALTER SEQUENCE public."EcoType_id_seq" OWNED BY public."EcoType".id;


--
-- Name: Ecosystem; Type: TABLE; Schema: public; Owner: cookeryc
--

CREATE TABLE public."Ecosystem" (
    id integer NOT NULL,
    name text NOT NULL,
    "typeId" integer NOT NULL
);


ALTER TABLE public."Ecosystem" OWNER TO cookeryc;

--
-- Name: Ecosystem_id_seq; Type: SEQUENCE; Schema: public; Owner: cookeryc
--

CREATE SEQUENCE public."Ecosystem_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Ecosystem_id_seq" OWNER TO cookeryc;

--
-- Name: Ecosystem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cookeryc
--

ALTER SEQUENCE public."Ecosystem_id_seq" OWNED BY public."Ecosystem".id;


--
-- Name: Feature; Type: TABLE; Schema: public; Owner: cookeryc
--

CREATE TABLE public."Feature" (
    id integer NOT NULL,
    description text NOT NULL,
    "projectId" integer NOT NULL
);


ALTER TABLE public."Feature" OWNER TO cookeryc;

--
-- Name: Feature_id_seq; Type: SEQUENCE; Schema: public; Owner: cookeryc
--

CREATE SEQUENCE public."Feature_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Feature_id_seq" OWNER TO cookeryc;

--
-- Name: Feature_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cookeryc
--

ALTER SEQUENCE public."Feature_id_seq" OWNED BY public."Feature".id;


--
-- Name: Issue; Type: TABLE; Schema: public; Owner: cookeryc
--

CREATE TABLE public."Issue" (
    id integer NOT NULL,
    description text NOT NULL,
    "projectId" integer NOT NULL
);


ALTER TABLE public."Issue" OWNER TO cookeryc;

--
-- Name: Issue_id_seq; Type: SEQUENCE; Schema: public; Owner: cookeryc
--

CREATE SEQUENCE public."Issue_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Issue_id_seq" OWNER TO cookeryc;

--
-- Name: Issue_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cookeryc
--

ALTER SEQUENCE public."Issue_id_seq" OWNED BY public."Issue".id;


--
-- Name: Link; Type: TABLE; Schema: public; Owner: cookeryc
--

CREATE TABLE public."Link" (
    id integer NOT NULL,
    name text NOT NULL,
    url text NOT NULL,
    "logoGrn" text NOT NULL,
    "logoOrg" text NOT NULL,
    "logoAlt" text NOT NULL,
    "personId" integer NOT NULL,
    "userId" integer NOT NULL
);


ALTER TABLE public."Link" OWNER TO cookeryc;

--
-- Name: Link_id_seq; Type: SEQUENCE; Schema: public; Owner: cookeryc
--

CREATE SEQUENCE public."Link_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Link_id_seq" OWNER TO cookeryc;

--
-- Name: Link_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cookeryc
--

ALTER SEQUENCE public."Link_id_seq" OWNED BY public."Link".id;


--
-- Name: Personal; Type: TABLE; Schema: public; Owner: cookeryc
--

CREATE TABLE public."Personal" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    description text NOT NULL,
    "imageAlt" text NOT NULL,
    "imageGrn" text NOT NULL,
    "imageOrg" text NOT NULL,
    "favColor" text NOT NULL,
    "starSign" text NOT NULL
);


ALTER TABLE public."Personal" OWNER TO cookeryc;

--
-- Name: Personal_id_seq; Type: SEQUENCE; Schema: public; Owner: cookeryc
--

CREATE SEQUENCE public."Personal_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Personal_id_seq" OWNER TO cookeryc;

--
-- Name: Personal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cookeryc
--

ALTER SEQUENCE public."Personal_id_seq" OWNED BY public."Personal".id;


--
-- Name: Project; Type: TABLE; Schema: public; Owner: cookeryc
--

CREATE TABLE public."Project" (
    id integer NOT NULL,
    name text NOT NULL,
    overview text NOT NULL,
    url text NOT NULL,
    "imageOrg" text,
    "imageGrn" text,
    "imageAlt" text,
    "typeId" integer NOT NULL,
    live boolean DEFAULT true NOT NULL,
    "dateMvp" timestamp(3) without time zone,
    "dateProd" timestamp(3) without time zone,
    "personId" integer NOT NULL,
    "userId" integer NOT NULL,
    repo text
);


ALTER TABLE public."Project" OWNER TO cookeryc;

--
-- Name: ProjectEcosystem; Type: TABLE; Schema: public; Owner: cookeryc
--

CREATE TABLE public."ProjectEcosystem" (
    id integer NOT NULL,
    name text NOT NULL,
    "ecoId" integer NOT NULL,
    "projectId" integer,
    "aboutId" integer
);


ALTER TABLE public."ProjectEcosystem" OWNER TO cookeryc;

--
-- Name: ProjectEcosystem_id_seq; Type: SEQUENCE; Schema: public; Owner: cookeryc
--

CREATE SEQUENCE public."ProjectEcosystem_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ProjectEcosystem_id_seq" OWNER TO cookeryc;

--
-- Name: ProjectEcosystem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cookeryc
--

ALTER SEQUENCE public."ProjectEcosystem_id_seq" OWNED BY public."ProjectEcosystem".id;


--
-- Name: ProjectType; Type: TABLE; Schema: public; Owner: cookeryc
--

CREATE TABLE public."ProjectType" (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."ProjectType" OWNER TO cookeryc;

--
-- Name: ProjectType_id_seq; Type: SEQUENCE; Schema: public; Owner: cookeryc
--

CREATE SEQUENCE public."ProjectType_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ProjectType_id_seq" OWNER TO cookeryc;

--
-- Name: ProjectType_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cookeryc
--

ALTER SEQUENCE public."ProjectType_id_seq" OWNED BY public."ProjectType".id;


--
-- Name: Project_id_seq; Type: SEQUENCE; Schema: public; Owner: cookeryc
--

CREATE SEQUENCE public."Project_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Project_id_seq" OWNER TO cookeryc;

--
-- Name: Project_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cookeryc
--

ALTER SEQUENCE public."Project_id_seq" OWNED BY public."Project".id;


--
-- Name: Role; Type: TABLE; Schema: public; Owner: cookeryc
--

CREATE TABLE public."Role" (
    id integer NOT NULL,
    name text NOT NULL,
    uuid text
);


ALTER TABLE public."Role" OWNER TO cookeryc;

--
-- Name: Role_id_seq; Type: SEQUENCE; Schema: public; Owner: cookeryc
--

CREATE SEQUENCE public."Role_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Role_id_seq" OWNER TO cookeryc;

--
-- Name: Role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cookeryc
--

ALTER SEQUENCE public."Role_id_seq" OWNED BY public."Role".id;


--
-- Name: Skill; Type: TABLE; Schema: public; Owner: cookeryc
--

CREATE TABLE public."Skill" (
    id integer NOT NULL,
    name text NOT NULL,
    "ecoId" integer NOT NULL,
    "personId" integer NOT NULL,
    "userId" integer NOT NULL
);


ALTER TABLE public."Skill" OWNER TO cookeryc;

--
-- Name: Skill_id_seq; Type: SEQUENCE; Schema: public; Owner: cookeryc
--

CREATE SEQUENCE public."Skill_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Skill_id_seq" OWNER TO cookeryc;

--
-- Name: Skill_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cookeryc
--

ALTER SEQUENCE public."Skill_id_seq" OWNED BY public."Skill".id;


--
-- Name: Tech; Type: TABLE; Schema: public; Owner: cookeryc
--

CREATE TABLE public."Tech" (
    id integer NOT NULL,
    "typeId" integer NOT NULL,
    name text NOT NULL,
    "ecoId" integer NOT NULL
);


ALTER TABLE public."Tech" OWNER TO cookeryc;

--
-- Name: TechType; Type: TABLE; Schema: public; Owner: cookeryc
--

CREATE TABLE public."TechType" (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."TechType" OWNER TO cookeryc;

--
-- Name: TechType_id_seq; Type: SEQUENCE; Schema: public; Owner: cookeryc
--

CREATE SEQUENCE public."TechType_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."TechType_id_seq" OWNER TO cookeryc;

--
-- Name: TechType_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cookeryc
--

ALTER SEQUENCE public."TechType_id_seq" OWNED BY public."TechType".id;


--
-- Name: Tech_id_seq; Type: SEQUENCE; Schema: public; Owner: cookeryc
--

CREATE SEQUENCE public."Tech_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Tech_id_seq" OWNER TO cookeryc;

--
-- Name: Tech_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cookeryc
--

ALTER SEQUENCE public."Tech_id_seq" OWNED BY public."Tech".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: cookeryc
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    "publicId" text NOT NULL,
    password text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."User" OWNER TO cookeryc;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: cookeryc
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO cookeryc;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cookeryc
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: _ProjectTech; Type: TABLE; Schema: public; Owner: cookeryc
--

CREATE TABLE public."_ProjectTech" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);


ALTER TABLE public."_ProjectTech" OWNER TO cookeryc;

--
-- Name: _SkillTech; Type: TABLE; Schema: public; Owner: cookeryc
--

CREATE TABLE public."_SkillTech" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);


ALTER TABLE public."_SkillTech" OWNER TO cookeryc;

--
-- Name: _UserRoles; Type: TABLE; Schema: public; Owner: cookeryc
--

CREATE TABLE public."_UserRoles" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);


ALTER TABLE public."_UserRoles" OWNER TO cookeryc;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: cookeryc
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO cookeryc;

--
-- Name: session; Type: TABLE; Schema: public; Owner: cookeryc
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.session OWNER TO cookeryc;

--
-- Name: About id; Type: DEFAULT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."About" ALTER COLUMN id SET DEFAULT nextval('public."About_id_seq"'::regclass);


--
-- Name: Contact id; Type: DEFAULT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."Contact" ALTER COLUMN id SET DEFAULT nextval('public."Contact_id_seq"'::regclass);


--
-- Name: EcoType id; Type: DEFAULT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."EcoType" ALTER COLUMN id SET DEFAULT nextval('public."EcoType_id_seq"'::regclass);


--
-- Name: Ecosystem id; Type: DEFAULT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."Ecosystem" ALTER COLUMN id SET DEFAULT nextval('public."Ecosystem_id_seq"'::regclass);


--
-- Name: Feature id; Type: DEFAULT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."Feature" ALTER COLUMN id SET DEFAULT nextval('public."Feature_id_seq"'::regclass);


--
-- Name: Issue id; Type: DEFAULT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."Issue" ALTER COLUMN id SET DEFAULT nextval('public."Issue_id_seq"'::regclass);


--
-- Name: Link id; Type: DEFAULT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."Link" ALTER COLUMN id SET DEFAULT nextval('public."Link_id_seq"'::regclass);


--
-- Name: Personal id; Type: DEFAULT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."Personal" ALTER COLUMN id SET DEFAULT nextval('public."Personal_id_seq"'::regclass);


--
-- Name: Project id; Type: DEFAULT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."Project" ALTER COLUMN id SET DEFAULT nextval('public."Project_id_seq"'::regclass);


--
-- Name: ProjectEcosystem id; Type: DEFAULT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."ProjectEcosystem" ALTER COLUMN id SET DEFAULT nextval('public."ProjectEcosystem_id_seq"'::regclass);


--
-- Name: ProjectType id; Type: DEFAULT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."ProjectType" ALTER COLUMN id SET DEFAULT nextval('public."ProjectType_id_seq"'::regclass);


--
-- Name: Role id; Type: DEFAULT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."Role" ALTER COLUMN id SET DEFAULT nextval('public."Role_id_seq"'::regclass);


--
-- Name: Skill id; Type: DEFAULT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."Skill" ALTER COLUMN id SET DEFAULT nextval('public."Skill_id_seq"'::regclass);


--
-- Name: Tech id; Type: DEFAULT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."Tech" ALTER COLUMN id SET DEFAULT nextval('public."Tech_id_seq"'::regclass);


--
-- Name: TechType id; Type: DEFAULT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."TechType" ALTER COLUMN id SET DEFAULT nextval('public."TechType_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Data for Name: About; Type: TABLE DATA; Schema: public; Owner: cookeryc
--

COPY public."About" (id, "userId", overview, "typeId", repo, "copyName", "copyYear") FROM stdin;
1	1	The server is built on Node.js with a PostGreSQL database, and the front end uses React.  The admin site is contained on the server side, to simplify the React site and separate concerns.  Also I had a font I really wanted to use for it.  The back end could conceivably host the data for multiple portfolio sites and has been built with that scalability in mind.	2	https://github.com/cookeryccoping/portfolio-client	John Hall	2025
\.


--
-- Data for Name: Contact; Type: TABLE DATA; Schema: public; Owner: cookeryc
--

COPY public."Contact" (id, email, name, "projectId", message, "timestamp", "personId") FROM stdin;
1	dan@dan.com	John	\N	this is a message	2025-09-12 02:50:59.103	1
2	stewy mcStew@stew/c,	Stew	1	this is another message	2025-09-12 02:57:13.249	1
3	dan@gmail.com	Dan	1	hshishofslj	2025-09-12 15:03:26.151	1
\.


--
-- Data for Name: EcoType; Type: TABLE DATA; Schema: public; Owner: cookeryc
--

COPY public."EcoType" (id, name) FROM stdin;
1	framework
2	language
3	CMS
4	database
5	platform
6	service
\.


--
-- Data for Name: Ecosystem; Type: TABLE DATA; Schema: public; Owner: cookeryc
--

COPY public."Ecosystem" (id, name, "typeId") FROM stdin;
1	React	1
2	Django	1
3	PostgreSQL	4
4	MongoDB	4
5	MySQL	4
6	Node.js	5
7	JavaScript	2
8	Php	2
9	HTML	2
10	CSS	2
11	Cloudinary	6
12	Salesforce.com	6
13	Flask	1
14	Heroku	6
\.


--
-- Data for Name: Feature; Type: TABLE DATA; Schema: public; Owner: cookeryc
--

COPY public."Feature" (id, description, "projectId") FROM stdin;
18	global store which affects user stats and progress	2
19	Multiple Objects which have various effects	2
20	AI generated images and backgrounds	2
21	Fully responsive	2
36	Pagination of recipes	4
37	full user profile	4
38	internal notification system	4
45	Address Management	1
46	Buy Now	1
47	Cheese and Beer Pairing	1
48	sortable activity feed	5
49	ability to like and comment	5
50	Seamless fully responsive UI	5
\.


--
-- Data for Name: Issue; Type: TABLE DATA; Schema: public; Owner: cookeryc
--

COPY public."Issue" (id, description, "projectId") FROM stdin;
14	Some JavaScript timing issues which can occasionally affect gameplay	2
15	Minor balancing issue with cumulative odds for certain events which mean some win conditions are unlikely to be met	2
30	No JavaScript	4
31	Questionable UI	4
32	Clunky back-end	4
39	Front End Design	1
40	STRIPE security	1
41	Checkout Address UI	1
42	Rudimentary Design	5
43	Limited Scope	5
44	Tough to scale with Flask	5
\.


--
-- Data for Name: Link; Type: TABLE DATA; Schema: public; Owner: cookeryc
--

COPY public."Link" (id, name, url, "logoGrn", "logoOrg", "logoAlt", "personId", "userId") FROM stdin;
1	LinkedIn	https://www.linkedin.com/in/john-hall-8722913/	/images/green-vecteezy_linkedin-png-icon_16716470.webp	/images/vecteezy_linkedin-png-icon_16716470.webp	LinkedIn logo in green	1	1
2	Github	https://github.com/cookeryccoping/	/images/green-github-mark-white.webp	/images/github-mark-white.webp	Github logo with light background	1	1
\.


--
-- Data for Name: Personal; Type: TABLE DATA; Schema: public; Owner: cookeryc
--

COPY public."Personal" (id, "userId", description, "imageAlt", "imageGrn", "imageOrg", "favColor", "starSign") FROM stdin;
1	1	John Hall could be described as a maverick, a visionary and a leader, consistently pushing back the boundaries of technology to produce projects which stand out. He could be, but unfortunately nobody describes him in that way.		/images/green-champers.webp	/images/champers.webp	Green	Aries
\.


--
-- Data for Name: Project; Type: TABLE DATA; Schema: public; Owner: cookeryc
--

COPY public."Project" (id, name, overview, url, "imageOrg", "imageGrn", "imageAlt", "typeId", live, "dateMvp", "dateProd", "personId", "userId", repo) FROM stdin;
1	Cheese and Beer	Cheese and Beer is a store site built with Django and PostGres as part of a level 5 diploma at Code Institute.  Whilst not production-ready by any means, it features a rich and intuitive UI with a number of production-ready features, limited Stripe integration and an embryonic CS module.\r\n\r\nIt also boasts a fantastic array of non-existent cheese and beer products.	https://cheesebeer.cookery-corner.co.uk	/images/serjan-midili-0y6OESoMWJo-unsplash.webp	/images/green-serjan-midili-0y6OESoMWJo-unsplash.webp	A selection of cheeses	2	t	2024-04-30 00:00:00	\N	1	1	https://github.com/cookeryccoping/cheese-and-beer
5	Hopes & Dreams	Originally conceived as an integrated social platform for people to build dreams and followings and seek help or funding from specialists became a simple dream posting platform. Built as part of the CI Diploma in Web Development to tight deadlines.	https://hopesanddreams-c6e1e042df41.herokuapp.com/	/images/bunny.webp	/images/green-bunny.webp	a cute line-drawn bunny, the iconic logo for Hopes and Dreams	2	t	2024-01-31 00:00:00	\N	1	1	https://github.com/cookeryccoping/hopes-and-dreams
2	The Lost King of Catland	The Lost King of Catland is a D&D style fantasy adventure game built using vanilla JavaScript, CSS and HTML.\r\n\r\nThe game reacts to user actions and remembers what they have done, which is weighted in the odds for certain situations.  Weapons, spells and potions have real in-game effects and (some) items have contextual uses. Creature stats vary from game to game, as do your own, to ensure no play-through is ever the same.	https://cookeryccoping.github.io/lost-king-part1/	/images/ragnar.webp	/images/green-ragnar.webp	Ragnar, the desperate warrior enemy from the Lost King of Catland	1	t	2023-10-05 00:00:00	\N	1	1	https://github.com/cookeryccoping/lost-king-part1
4	Cookery Corner	John Hall's first foray into web design, this site has very gradually morphed from a basic html static site into a fully dynamic web application with the latest re-build in 2020. The styling was always intended as a parody, and the technology itself was always a test-bed. As such it is unlikely that this website will ever be finished.	https://cookery-corner.co.uk	/images/logo.webp	/images/green-logo.webp	a crossed knife and fork drawn shakily in paint - the iconic Cookery Corner logo	2	t	2006-12-31 00:00:00	\N	1	1	https://github.com/cookeryccoping/cookery-corner
\.


--
-- Data for Name: ProjectEcosystem; Type: TABLE DATA; Schema: public; Owner: cookeryc
--

COPY public."ProjectEcosystem" (id, name, "ecoId", "projectId", "aboutId") FROM stdin;
5	CSS	10	1	\N
1	Django	2	1	\N
2	JavaScript	7	1	\N
7	JavaScript	7	2	\N
8	HTML	9	2	\N
9	CSS	10	2	\N
13	Node.js	6	\N	1
4	HTML	9	1	\N
6	PostgreSQL	3	1	\N
14	React	1	\N	1
15	PostgreSQL	3	\N	1
16	JavaScript	7	\N	1
17	HTML	9	\N	1
18	CSS	10	\N	1
19	Php	8	4	\N
20	MySQL	5	4	\N
21	HTML	9	4	\N
22	CSS	10	4	\N
23	Flask	13	5	\N
24	Cloudinary	11	5	\N
25	MongoDB	4	5	\N
26	HTML	9	5	\N
27	CSS	10	5	\N
28	JavaScript	7	5	\N
29	Cloudinary	11	1	\N
30	Heroku	14	5	\N
\.


--
-- Data for Name: ProjectType; Type: TABLE DATA; Schema: public; Owner: cookeryc
--

COPY public."ProjectType" (id, name) FROM stdin;
1	Single Page Application
2	Full Stack
3	Static Website
4	WordPress Application
\.


--
-- Data for Name: Role; Type: TABLE DATA; Schema: public; Owner: cookeryc
--

COPY public."Role" (id, name, uuid) FROM stdin;
1	owner	2347b0c9-acf6-44e1-ae99-d6f13c77ab44
\.


--
-- Data for Name: Skill; Type: TABLE DATA; Schema: public; Owner: cookeryc
--

COPY public."Skill" (id, name, "ecoId", "personId", "userId") FROM stdin;
2	JavaScript	7	1	1
3	Django	2	1	1
1	React	1	1	1
\.


--
-- Data for Name: Tech; Type: TABLE DATA; Schema: public; Owner: cookeryc
--

COPY public."Tech" (id, "typeId", name, "ecoId") FROM stdin;
10	5	Prisma	6
9	10	TypeScript	7
1	1	Redux	1
3	1	Zustand	1
4	1	Tanstack Query	1
5	1	Tanstack Router	1
6	1	allAuth	2
7	9	Express	6
2	1	RTK Query	1
11	1	WhiteNoise	2
\.


--
-- Data for Name: TechType; Type: TABLE DATA; Schema: public; Owner: cookeryc
--

COPY public."TechType" (id, name) FROM stdin;
1	library
2	plugin
3	testing
4	build tool
5	ORM
6	CLI
7	formatter
8	deployment
9	framework
10	language
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: cookeryc
--

COPY public."User" (id, name, email, "publicId", password, "createdAt") FROM stdin;
1	John Hall	rowlandcoping@gmail.com	2732c2f4-12d1-4d18-a2e2-97624ee43775	$2b$10$5U//bMKI/Uv69J8Tw.BbLuzs1Vi6HSZSEUOJjbodFkLkH/fHEQc7.	2025-08-06 12:24:06.698
\.


--
-- Data for Name: _ProjectTech; Type: TABLE DATA; Schema: public; Owner: cookeryc
--

COPY public."_ProjectTech" ("A", "B") FROM stdin;
1	6
2	9
13	7
13	10
14	3
14	4
14	5
16	9
\.


--
-- Data for Name: _SkillTech; Type: TABLE DATA; Schema: public; Owner: cookeryc
--

COPY public."_SkillTech" ("A", "B") FROM stdin;
1	1
1	3
1	4
2	9
3	6
1	2
1	5
\.


--
-- Data for Name: _UserRoles; Type: TABLE DATA; Schema: public; Owner: cookeryc
--

COPY public."_UserRoles" ("A", "B") FROM stdin;
1	1
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: cookeryc
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
090366d3-7138-431b-847c-3fff95a9e5c7	7d88aeb71bd27c152ae3f410daa0d7f457bd9c857fc42fb8811372e4765a775b	2025-08-06 13:12:16.107559+01	20250806121216_init	\N	\N	2025-08-06 13:12:16.079859+01	1
6314721e-3a8f-4e79-baa3-62c70f3e7b0b	556ba92513db9a6710fe367727e1b549adad40983c30a70200bec5b7bb4f283e	2025-08-18 19:55:49.164596+01	20250818185549_added	\N	\N	2025-08-18 19:55:49.157028+01	1
abdc5a8c-7679-4390-91d2-3c276198984a	744bafbf9c73f9f7a9519c2db8e41ea46ba83e0cc945216dc4bfa84229980da0	2025-08-19 17:59:16.400968+01	20250819165916_added	\N	\N	2025-08-19 17:59:16.392419+01	1
c0d1b35c-5352-4467-966f-e826d415d70d	626785daab265afccd9e5496d2354da1687dcaceee823c7cbac2db2abaa4191e	2025-08-20 02:00:52.410689+01	20250820010052_made	\N	\N	2025-08-20 02:00:52.404589+01	1
2443acb3-2f4b-48db-bdda-e33fe7ef8b4c	7b6ea80db48fae0a79c2b0e655753a15e8b08d4c08c3de7a564c3f4f393ac251	2025-08-29 15:50:08.507176+01	20250829145008_added_repo_field	\N	\N	2025-08-29 15:50:08.50353+01	1
68678a93-e4d7-46a1-82e3-c69f03069ffc	f429154bd5eb9a94ed169faff602d24b35e54333a5ecc33b55a472c767b3cea0	2025-09-12 16:42:53.570826+01	20250912154253_add_image_to_profile	\N	\N	2025-09-12 16:42:53.566527+01	1
cd582007-fca3-4102-89cd-4a2b75a92d80	319447283eb830daf913235a688cdff65bc64e271dfd0ecc4b1bc0d6461c2e38	2025-09-12 16:46:16.50892+01	20250912154616_add_frivolous_additional_fields	\N	\N	2025-09-12 16:46:16.50585+01	1
4c60f6d4-7585-46df-b876-9b631b0d985f	5a3253dbb84cd86e177729b81091bbf7b3be638043598fe6f9183d81012340e7	2025-09-17 15:34:46.8418+01	20250917143446_add_about_schema	\N	\N	2025-09-17 15:34:46.831413+01	1
eae7ea30-7b55-4468-b517-9fe21b527a95	40461df49cbc90b76fc6db03884ea1d11fdcbf77ae80adb9f2fe29ff8843923c	2025-09-17 15:51:10.530132+01	20250917145110_add_copyright_info	\N	\N	2025-09-17 15:51:10.52715+01	1
717acecd-1203-4b97-91bc-8a9b0258f016	09262ec6c7414537fd11d0e49d9fd4c1f08b07d3da88cb23043072cf4cb5c82e	2025-09-17 16:14:31.294987+01	20250917151431_add_about_constraints	\N	\N	2025-09-17 16:14:31.290975+01	1
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: cookeryc
--

COPY public.session (sid, sess, expire) FROM stdin;
ax8627FTpFpbHkhD5zEklzTujvTHRCxH	{"cookie":{"originalMaxAge":7200000,"expires":"2025-09-18T13:32:26.037Z","httpOnly":true,"path":"/"},"userId":1}	2025-09-18 15:25:15
kFjfSQ6l3XpDp1VzlsBCAf_sQx58MSGQ	{"cookie":{"originalMaxAge":7200000,"expires":"2025-09-25T06:36:14.346Z","httpOnly":true,"path":"/"},"userId":1}	2025-09-25 07:54:54
\.


--
-- Name: About_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cookeryc
--

SELECT pg_catalog.setval('public."About_id_seq"', 1, true);


--
-- Name: Contact_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cookeryc
--

SELECT pg_catalog.setval('public."Contact_id_seq"', 3, true);


--
-- Name: EcoType_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cookeryc
--

SELECT pg_catalog.setval('public."EcoType_id_seq"', 7, true);


--
-- Name: Ecosystem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cookeryc
--

SELECT pg_catalog.setval('public."Ecosystem_id_seq"', 14, true);


--
-- Name: Feature_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cookeryc
--

SELECT pg_catalog.setval('public."Feature_id_seq"', 50, true);


--
-- Name: Issue_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cookeryc
--

SELECT pg_catalog.setval('public."Issue_id_seq"', 44, true);


--
-- Name: Link_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cookeryc
--

SELECT pg_catalog.setval('public."Link_id_seq"', 2, true);


--
-- Name: Personal_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cookeryc
--

SELECT pg_catalog.setval('public."Personal_id_seq"', 1, true);


--
-- Name: ProjectEcosystem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cookeryc
--

SELECT pg_catalog.setval('public."ProjectEcosystem_id_seq"', 30, true);


--
-- Name: ProjectType_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cookeryc
--

SELECT pg_catalog.setval('public."ProjectType_id_seq"', 4, true);


--
-- Name: Project_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cookeryc
--

SELECT pg_catalog.setval('public."Project_id_seq"', 5, true);


--
-- Name: Role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cookeryc
--

SELECT pg_catalog.setval('public."Role_id_seq"', 1, true);


--
-- Name: Skill_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cookeryc
--

SELECT pg_catalog.setval('public."Skill_id_seq"', 3, true);


--
-- Name: TechType_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cookeryc
--

SELECT pg_catalog.setval('public."TechType_id_seq"', 10, true);


--
-- Name: Tech_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cookeryc
--

SELECT pg_catalog.setval('public."Tech_id_seq"', 11, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cookeryc
--

SELECT pg_catalog.setval('public."User_id_seq"', 1, true);


--
-- Name: About About_pkey; Type: CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."About"
    ADD CONSTRAINT "About_pkey" PRIMARY KEY (id);


--
-- Name: Contact Contact_pkey; Type: CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."Contact"
    ADD CONSTRAINT "Contact_pkey" PRIMARY KEY (id);


--
-- Name: EcoType EcoType_pkey; Type: CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."EcoType"
    ADD CONSTRAINT "EcoType_pkey" PRIMARY KEY (id);


--
-- Name: Ecosystem Ecosystem_pkey; Type: CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."Ecosystem"
    ADD CONSTRAINT "Ecosystem_pkey" PRIMARY KEY (id);


--
-- Name: Feature Feature_pkey; Type: CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."Feature"
    ADD CONSTRAINT "Feature_pkey" PRIMARY KEY (id);


--
-- Name: Issue Issue_pkey; Type: CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."Issue"
    ADD CONSTRAINT "Issue_pkey" PRIMARY KEY (id);


--
-- Name: Link Link_pkey; Type: CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."Link"
    ADD CONSTRAINT "Link_pkey" PRIMARY KEY (id);


--
-- Name: Personal Personal_pkey; Type: CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."Personal"
    ADD CONSTRAINT "Personal_pkey" PRIMARY KEY (id);


--
-- Name: ProjectEcosystem ProjectEcosystem_pkey; Type: CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."ProjectEcosystem"
    ADD CONSTRAINT "ProjectEcosystem_pkey" PRIMARY KEY (id);


--
-- Name: ProjectType ProjectType_pkey; Type: CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."ProjectType"
    ADD CONSTRAINT "ProjectType_pkey" PRIMARY KEY (id);


--
-- Name: Project Project_pkey; Type: CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_pkey" PRIMARY KEY (id);


--
-- Name: Role Role_pkey; Type: CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."Role"
    ADD CONSTRAINT "Role_pkey" PRIMARY KEY (id);


--
-- Name: Skill Skill_pkey; Type: CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."Skill"
    ADD CONSTRAINT "Skill_pkey" PRIMARY KEY (id);


--
-- Name: TechType TechType_pkey; Type: CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."TechType"
    ADD CONSTRAINT "TechType_pkey" PRIMARY KEY (id);


--
-- Name: Tech Tech_pkey; Type: CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."Tech"
    ADD CONSTRAINT "Tech_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _ProjectTech _ProjectTech_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."_ProjectTech"
    ADD CONSTRAINT "_ProjectTech_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _SkillTech _SkillTech_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."_SkillTech"
    ADD CONSTRAINT "_SkillTech_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _UserRoles _UserRoles_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."_UserRoles"
    ADD CONSTRAINT "_UserRoles_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: About_userId_key; Type: INDEX; Schema: public; Owner: cookeryc
--

CREATE UNIQUE INDEX "About_userId_key" ON public."About" USING btree ("userId");


--
-- Name: Ecosystem_name_key; Type: INDEX; Schema: public; Owner: cookeryc
--

CREATE UNIQUE INDEX "Ecosystem_name_key" ON public."Ecosystem" USING btree (name);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: cookeryc
--

CREATE INDEX "IDX_session_expire" ON public.session USING btree (expire);


--
-- Name: Link_name_key; Type: INDEX; Schema: public; Owner: cookeryc
--

CREATE UNIQUE INDEX "Link_name_key" ON public."Link" USING btree (name);


--
-- Name: Link_url_key; Type: INDEX; Schema: public; Owner: cookeryc
--

CREATE UNIQUE INDEX "Link_url_key" ON public."Link" USING btree (url);


--
-- Name: Personal_userId_key; Type: INDEX; Schema: public; Owner: cookeryc
--

CREATE UNIQUE INDEX "Personal_userId_key" ON public."Personal" USING btree ("userId");


--
-- Name: ProjectEcosystem_aboutId_ecoId_key; Type: INDEX; Schema: public; Owner: cookeryc
--

CREATE UNIQUE INDEX "ProjectEcosystem_aboutId_ecoId_key" ON public."ProjectEcosystem" USING btree ("aboutId", "ecoId");


--
-- Name: ProjectEcosystem_projectId_ecoId_key; Type: INDEX; Schema: public; Owner: cookeryc
--

CREATE UNIQUE INDEX "ProjectEcosystem_projectId_ecoId_key" ON public."ProjectEcosystem" USING btree ("projectId", "ecoId");


--
-- Name: ProjectType_name_key; Type: INDEX; Schema: public; Owner: cookeryc
--

CREATE UNIQUE INDEX "ProjectType_name_key" ON public."ProjectType" USING btree (name);


--
-- Name: Project_name_key; Type: INDEX; Schema: public; Owner: cookeryc
--

CREATE UNIQUE INDEX "Project_name_key" ON public."Project" USING btree (name);


--
-- Name: Project_url_key; Type: INDEX; Schema: public; Owner: cookeryc
--

CREATE UNIQUE INDEX "Project_url_key" ON public."Project" USING btree (url);


--
-- Name: Role_name_key; Type: INDEX; Schema: public; Owner: cookeryc
--

CREATE UNIQUE INDEX "Role_name_key" ON public."Role" USING btree (name);


--
-- Name: Role_uuid_key; Type: INDEX; Schema: public; Owner: cookeryc
--

CREATE UNIQUE INDEX "Role_uuid_key" ON public."Role" USING btree (uuid);


--
-- Name: Skill_ecoId_personId_key; Type: INDEX; Schema: public; Owner: cookeryc
--

CREATE UNIQUE INDEX "Skill_ecoId_personId_key" ON public."Skill" USING btree ("ecoId", "personId");


--
-- Name: Tech_name_key; Type: INDEX; Schema: public; Owner: cookeryc
--

CREATE UNIQUE INDEX "Tech_name_key" ON public."Tech" USING btree (name);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: cookeryc
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_publicId_key; Type: INDEX; Schema: public; Owner: cookeryc
--

CREATE UNIQUE INDEX "User_publicId_key" ON public."User" USING btree ("publicId");


--
-- Name: _ProjectTech_B_index; Type: INDEX; Schema: public; Owner: cookeryc
--

CREATE INDEX "_ProjectTech_B_index" ON public."_ProjectTech" USING btree ("B");


--
-- Name: _SkillTech_B_index; Type: INDEX; Schema: public; Owner: cookeryc
--

CREATE INDEX "_SkillTech_B_index" ON public."_SkillTech" USING btree ("B");


--
-- Name: _UserRoles_B_index; Type: INDEX; Schema: public; Owner: cookeryc
--

CREATE INDEX "_UserRoles_B_index" ON public."_UserRoles" USING btree ("B");


--
-- Name: About About_typeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."About"
    ADD CONSTRAINT "About_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES public."ProjectType"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: About About_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."About"
    ADD CONSTRAINT "About_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Contact Contact_personId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."Contact"
    ADD CONSTRAINT "Contact_personId_fkey" FOREIGN KEY ("personId") REFERENCES public."Personal"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Contact Contact_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."Contact"
    ADD CONSTRAINT "Contact_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Ecosystem Ecosystem_typeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."Ecosystem"
    ADD CONSTRAINT "Ecosystem_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES public."EcoType"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Feature Feature_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."Feature"
    ADD CONSTRAINT "Feature_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Issue Issue_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."Issue"
    ADD CONSTRAINT "Issue_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Link Link_personId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."Link"
    ADD CONSTRAINT "Link_personId_fkey" FOREIGN KEY ("personId") REFERENCES public."Personal"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Link Link_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."Link"
    ADD CONSTRAINT "Link_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Personal Personal_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."Personal"
    ADD CONSTRAINT "Personal_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ProjectEcosystem ProjectEcosystem_aboutId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."ProjectEcosystem"
    ADD CONSTRAINT "ProjectEcosystem_aboutId_fkey" FOREIGN KEY ("aboutId") REFERENCES public."About"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ProjectEcosystem ProjectEcosystem_ecoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."ProjectEcosystem"
    ADD CONSTRAINT "ProjectEcosystem_ecoId_fkey" FOREIGN KEY ("ecoId") REFERENCES public."Ecosystem"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ProjectEcosystem ProjectEcosystem_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."ProjectEcosystem"
    ADD CONSTRAINT "ProjectEcosystem_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Project Project_personId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_personId_fkey" FOREIGN KEY ("personId") REFERENCES public."Personal"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Project Project_typeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES public."ProjectType"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Project Project_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Skill Skill_ecoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."Skill"
    ADD CONSTRAINT "Skill_ecoId_fkey" FOREIGN KEY ("ecoId") REFERENCES public."Ecosystem"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Skill Skill_personId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."Skill"
    ADD CONSTRAINT "Skill_personId_fkey" FOREIGN KEY ("personId") REFERENCES public."Personal"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Skill Skill_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."Skill"
    ADD CONSTRAINT "Skill_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Tech Tech_ecoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."Tech"
    ADD CONSTRAINT "Tech_ecoId_fkey" FOREIGN KEY ("ecoId") REFERENCES public."Ecosystem"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Tech Tech_typeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."Tech"
    ADD CONSTRAINT "Tech_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES public."TechType"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: _ProjectTech _ProjectTech_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."_ProjectTech"
    ADD CONSTRAINT "_ProjectTech_A_fkey" FOREIGN KEY ("A") REFERENCES public."ProjectEcosystem"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _ProjectTech _ProjectTech_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."_ProjectTech"
    ADD CONSTRAINT "_ProjectTech_B_fkey" FOREIGN KEY ("B") REFERENCES public."Tech"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _SkillTech _SkillTech_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."_SkillTech"
    ADD CONSTRAINT "_SkillTech_A_fkey" FOREIGN KEY ("A") REFERENCES public."Skill"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _SkillTech _SkillTech_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."_SkillTech"
    ADD CONSTRAINT "_SkillTech_B_fkey" FOREIGN KEY ("B") REFERENCES public."Tech"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _UserRoles _UserRoles_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."_UserRoles"
    ADD CONSTRAINT "_UserRoles_A_fkey" FOREIGN KEY ("A") REFERENCES public."Role"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _UserRoles _UserRoles_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: cookeryc
--

ALTER TABLE ONLY public."_UserRoles"
    ADD CONSTRAINT "_UserRoles_B_fkey" FOREIGN KEY ("B") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--




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


CREATE SCHEMA IF NOT EXISTS "drizzle";


ALTER SCHEMA "drizzle" OWNER TO "postgres";


CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "moddatetime" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."frequency" AS ENUM (
    'daily',
    'weekly',
    'monthly'
);


ALTER TYPE "public"."frequency" OWNER TO "postgres";


CREATE TYPE "public"."language" AS ENUM (
    'JP',
    'EN'
);


ALTER TYPE "public"."language" OWNER TO "postgres";


CREATE TYPE "public"."nextPageType" AS ENUM (
    'last',
    'parameter',
    'url',
    'next',
    'pagenation'
);


ALTER TYPE "public"."nextPageType" OWNER TO "postgres";


CREATE TYPE "public"."siteType" AS ENUM (
    'links',
    'single',
    'multiple'
);


ALTER TYPE "public"."siteType" OWNER TO "postgres";


CREATE TYPE "public"."status" AS ENUM (
    'active',
    'suspended'
);


ALTER TYPE "public"."status" OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "drizzle"."__drizzle_migrations" (
    "id" integer NOT NULL,
    "hash" "text" NOT NULL,
    "created_at" bigint
);


ALTER TABLE "drizzle"."__drizzle_migrations" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "drizzle"."__drizzle_migrations_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "drizzle"."__drizzle_migrations_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "drizzle"."__drizzle_migrations_id_seq" OWNED BY "drizzle"."__drizzle_migrations"."id";



CREATE TABLE IF NOT EXISTS "public"."scrapers" (
    "id" integer NOT NULL,
    "name" character varying(255) NOT NULL,
    "category" character varying(255) NOT NULL,
    "root_url" character varying(400) NOT NULL,
    "entry_url" character varying(400) NOT NULL,
    "language" "public"."language" NOT NULL,
    "site_type" "public"."siteType" NOT NULL,
    "next_page_type" "public"."nextPageType" NOT NULL,
    "last_url_selector" character varying(255),
    "last_page_number_regexp" character varying(255),
    "next_page_parameter" character varying(255),
    "next_page_link_selector" character varying(255),
    "next_page_url_regexp" character varying(255),
    "tag_filtering" boolean DEFAULT false NOT NULL,
    "tag_collect" boolean DEFAULT true NOT NULL,
    "tags" character varying(255),
    "index_link_selector" character varying(255),
    "article_block_selector" character varying(255),
    "article_title_selector" character varying(255),
    "article_body_selector" character varying(255) NOT NULL,
    "article_tag_selector" character varying(255),
    "frequency" "public"."frequency" NOT NULL,
    "status" "public"."status" DEFAULT 'suspended'::"public"."status" NOT NULL,
    "last_run" timestamp(2) with time zone,
    "next_run_scheduled" timestamp(2) with time zone,
    "updated_at" timestamp(2) with time zone DEFAULT "now"(),
    "created_at" timestamp(2) with time zone DEFAULT "now"()
);


ALTER TABLE "public"."scrapers" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."scrapers_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."scrapers_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."scrapers_id_seq" OWNED BY "public"."scrapers"."id";



CREATE TABLE IF NOT EXISTS "public"."site_category" (
    "id" integer NOT NULL,
    "name" character varying(255) NOT NULL,
    "updated_at" timestamp(2) with time zone,
    "created_at" timestamp(2) with time zone DEFAULT "now"()
);


ALTER TABLE "public"."site_category" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."site_category_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."site_category_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."site_category_id_seq" OWNED BY "public"."site_category"."id";



CREATE TABLE IF NOT EXISTS "public"."tmp_dom_for_validation" (
    "id" bigint NOT NULL,
    "dom" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."tmp_dom_for_validation" OWNER TO "postgres";


ALTER TABLE "public"."tmp_dom_for_validation" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."tmp_dom_for_validation_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE ONLY "drizzle"."__drizzle_migrations" ALTER COLUMN "id" SET DEFAULT "nextval"('"drizzle"."__drizzle_migrations_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."scrapers" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."scrapers_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."site_category" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."site_category_id_seq"'::"regclass");



ALTER TABLE ONLY "drizzle"."__drizzle_migrations"
    ADD CONSTRAINT "__drizzle_migrations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."scrapers"
    ADD CONSTRAINT "scrapers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."site_category"
    ADD CONSTRAINT "site_category_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tmp_dom_for_validation"
    ADD CONSTRAINT "tmp_dom_for_validation_pkey" PRIMARY KEY ("id");



CREATE OR REPLACE TRIGGER "handle_update_at" BEFORE UPDATE ON "public"."scrapers" FOR EACH ROW EXECUTE FUNCTION "extensions"."moddatetime"();



CREATE OR REPLACE TRIGGER "handle_updated_at__site_category" BEFORE UPDATE ON "public"."site_category" FOR EACH ROW EXECUTE FUNCTION "extensions"."moddatetime"();



CREATE POLICY "Enable insert for authenticated users only" ON "public"."site_category" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."tmp_dom_for_validation" FOR INSERT TO "authenticated" WITH CHECK (true);



ALTER TABLE "public"."site_category" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tmp_dom_for_validation" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";





















































































































































































































GRANT ALL ON TABLE "public"."scrapers" TO "anon";
GRANT ALL ON TABLE "public"."scrapers" TO "authenticated";
GRANT ALL ON TABLE "public"."scrapers" TO "service_role";



GRANT ALL ON SEQUENCE "public"."scrapers_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."scrapers_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."scrapers_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."site_category" TO "anon";
GRANT ALL ON TABLE "public"."site_category" TO "authenticated";
GRANT ALL ON TABLE "public"."site_category" TO "service_role";



GRANT ALL ON SEQUENCE "public"."site_category_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."site_category_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."site_category_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."tmp_dom_for_validation" TO "anon";
GRANT ALL ON TABLE "public"."tmp_dom_for_validation" TO "authenticated";
GRANT ALL ON TABLE "public"."tmp_dom_for_validation" TO "service_role";



GRANT ALL ON SEQUENCE "public"."tmp_dom_for_validation_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."tmp_dom_for_validation_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."tmp_dom_for_validation_id_seq" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;

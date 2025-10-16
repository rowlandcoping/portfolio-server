GRANT cookeryc_rowland TO cookeryc;

DO $$
DECLARE
    obj RECORD;
BEGIN
    -- Tables
    FOR obj IN
        SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    LOOP
        EXECUTE format('ALTER TABLE public.%I OWNER TO cookeryc_rowland;', obj.tablename);
    END LOOP;

    -- Sequences
    FOR obj IN
        SELECT sequencename FROM pg_sequences WHERE schemaname = 'public'
    LOOP
        EXECUTE format('ALTER SEQUENCE public.%I OWNER TO cookeryc_rowland;', obj.sequencename);
    END LOOP;

    -- Views
    FOR obj IN
        SELECT table_name FROM information_schema.views WHERE table_schema = 'public'
    LOOP
        EXECUTE format('ALTER VIEW public.%I OWNER TO cookeryc_rowland;', obj.table_name);
    END LOOP;
END$$;

-- Grant all privileges on the public schema
GRANT ALL ON SCHEMA public TO cookeryc_rowland;

-- Grant privileges on all tables and sequences
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO cookeryc_rowland;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO cookeryc_rowland;
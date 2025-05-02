--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 17.4

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

--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO supabase_admin;

--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA extensions;


ALTER SCHEMA extensions OWNER TO postgres;

--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql;


ALTER SCHEMA graphql OWNER TO supabase_admin;

--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql_public;


ALTER SCHEMA graphql_public OWNER TO supabase_admin;

--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: pgbouncer
--

CREATE SCHEMA pgbouncer;


ALTER SCHEMA pgbouncer OWNER TO pgbouncer;

--
-- Name: pgsodium; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA pgsodium;


ALTER SCHEMA pgsodium OWNER TO supabase_admin;

--
-- Name: pgsodium; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgsodium WITH SCHEMA pgsodium;


--
-- Name: EXTENSION pgsodium; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgsodium IS 'Pgsodium is a modern cryptography library for Postgres.';


--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA realtime;


ALTER SCHEMA realtime OWNER TO supabase_admin;

--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA storage;


ALTER SCHEMA storage OWNER TO supabase_admin;

--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA vault;


ALTER SCHEMA vault OWNER TO supabase_admin;

--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;


--
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: pgjwt; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgjwt WITH SCHEMA extensions;


--
-- Name: EXTENSION pgjwt; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgjwt IS 'JSON Web Token API for Postgresql';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


ALTER TYPE auth.aal_level OWNER TO supabase_auth_admin;

--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


ALTER TYPE auth.code_challenge_method OWNER TO supabase_auth_admin;

--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE auth.factor_status OWNER TO supabase_auth_admin;

--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


ALTER TYPE auth.factor_type OWNER TO supabase_auth_admin;

--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


ALTER TYPE auth.one_time_token_type OWNER TO supabase_auth_admin;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'CLIENT',
    'ADMIN',
    'STAFF'
);


ALTER TYPE public."Role" OWNER TO postgres;

--
-- Name: action; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


ALTER TYPE realtime.action OWNER TO supabase_admin;

--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


ALTER TYPE realtime.equality_op OWNER TO supabase_admin;

--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


ALTER TYPE realtime.user_defined_filter OWNER TO supabase_admin;

--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


ALTER TYPE realtime.wal_column OWNER TO supabase_admin;

--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


ALTER TYPE realtime.wal_rls OWNER TO supabase_admin;

--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


ALTER FUNCTION auth.email() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


ALTER FUNCTION auth.jwt() OWNER TO supabase_auth_admin;

--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: postgres
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_cron_access() OWNER TO postgres;

--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: postgres
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


ALTER FUNCTION extensions.grant_pg_graphql_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: postgres
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_net_access() OWNER TO postgres;

--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: postgres
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_ddl_watch() OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_drop_watch() OWNER TO supabase_admin;

--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


ALTER FUNCTION extensions.set_graphql_placeholder() OWNER TO supabase_admin;

--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: postgres
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    RAISE WARNING 'PgBouncer auth request: %', p_usename;

    RETURN QUERY
    SELECT usename::TEXT, passwd::TEXT FROM pg_catalog.pg_shadow
    WHERE usename = p_usename;
END;
$$;


ALTER FUNCTION pgbouncer.get_auth(p_usename text) OWNER TO postgres;

--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_;

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


ALTER FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


ALTER FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) OWNER TO supabase_admin;

--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


ALTER FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) OWNER TO supabase_admin;

--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $$;


ALTER FUNCTION realtime."cast"(val text, type_ regtype) OWNER TO supabase_admin;

--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) OWNER TO supabase_admin;

--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


ALTER FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) OWNER TO supabase_admin;

--
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS SETOF realtime.wal_rls
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


ALTER FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


ALTER FUNCTION realtime.quote_wal2json(entity regclass) OWNER TO supabase_admin;

--
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  BEGIN
    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (payload, event, topic, private, extension)
    VALUES (payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      PERFORM pg_notify(
          'realtime:system',
          jsonb_build_object(
              'error', SQLERRM,
              'function', 'realtime.send',
              'event', event,
              'topic', topic,
              'private', private
          )::text
      );
  END;
END;
$$;


ALTER FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) OWNER TO supabase_admin;

--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


ALTER FUNCTION realtime.subscription_check_filters() OWNER TO supabase_admin;

--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


ALTER FUNCTION realtime.to_regrole(role_name text) OWNER TO supabase_admin;

--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


ALTER FUNCTION realtime.topic() OWNER TO supabase_realtime_admin;

--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


ALTER FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) OWNER TO supabase_storage_admin;

--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
_filename text;
BEGIN
	select string_to_array(name, '/') into _parts;
	select _parts[array_length(_parts,1)] into _filename;
	-- @todo return the last part instead of 2
	return reverse(split_part(reverse(_filename), '.', 1));
END
$$;


ALTER FUNCTION storage.extension(name text) OWNER TO supabase_storage_admin;

--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


ALTER FUNCTION storage.filename(name text) OWNER TO supabase_storage_admin;

--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[1:array_length(_parts,1)-1];
END
$$;


ALTER FUNCTION storage.foldername(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::int) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION storage.get_size_by_bucket() OWNER TO supabase_storage_admin;

--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


ALTER FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text) OWNER TO supabase_storage_admin;

--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;


ALTER FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text) OWNER TO supabase_storage_admin;

--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


ALTER FUNCTION storage.operation() OWNER TO supabase_storage_admin;

--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
  v_order_by text;
  v_sort_order text;
begin
  case
    when sortcolumn = 'name' then
      v_order_by = 'name';
    when sortcolumn = 'updated_at' then
      v_order_by = 'updated_at';
    when sortcolumn = 'created_at' then
      v_order_by = 'created_at';
    when sortcolumn = 'last_accessed_at' then
      v_order_by = 'last_accessed_at';
    else
      v_order_by = 'name';
  end case;

  case
    when sortorder = 'asc' then
      v_sort_order = 'asc';
    when sortorder = 'desc' then
      v_sort_order = 'desc';
    else
      v_sort_order = 'asc';
  end case;

  v_order_by = v_order_by || ' ' || v_sort_order;

  return query execute
    'with folders as (
       select path_tokens[$1] as folder
       from storage.objects
         where objects.name ilike $2 || $3 || ''%''
           and bucket_id = $4
           and array_length(objects.path_tokens, 1) <> $1
       group by folder
       order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


ALTER FUNCTION storage.update_updated_at_column() OWNER TO supabase_storage_admin;

--
-- Name: secrets_encrypt_secret_secret(); Type: FUNCTION; Schema: vault; Owner: supabase_admin
--

CREATE FUNCTION vault.secrets_encrypt_secret_secret() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
		BEGIN
		        new.secret = CASE WHEN new.secret IS NULL THEN NULL ELSE
			CASE WHEN new.key_id IS NULL THEN NULL ELSE pg_catalog.encode(
			  pgsodium.crypto_aead_det_encrypt(
				pg_catalog.convert_to(new.secret, 'utf8'),
				pg_catalog.convert_to((new.id::text || new.description::text || new.created_at::text || new.updated_at::text)::text, 'utf8'),
				new.key_id::uuid,
				new.nonce
			  ),
				'base64') END END;
		RETURN new;
		END;
		$$;


ALTER FUNCTION vault.secrets_encrypt_secret_secret() OWNER TO supabase_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE auth.audit_log_entries OWNER TO supabase_auth_admin;

--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text NOT NULL,
    code_challenge_method auth.code_challenge_method NOT NULL,
    code_challenge text NOT NULL,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone
);


ALTER TABLE auth.flow_state OWNER TO supabase_auth_admin;

--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.flow_state IS 'stores metadata for pkce logins';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE auth.identities OWNER TO supabase_auth_admin;

--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.instances OWNER TO supabase_auth_admin;

--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


ALTER TABLE auth.mfa_amr_claims OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


ALTER TABLE auth.mfa_challenges OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid
);


ALTER TABLE auth.mfa_factors OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


ALTER TABLE auth.one_time_tokens OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


ALTER TABLE auth.refresh_tokens OWNER TO supabase_auth_admin;

--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.refresh_tokens_id_seq OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


ALTER TABLE auth.saml_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


ALTER TABLE auth.saml_relay_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text
);


ALTER TABLE auth.sessions OWNER TO supabase_auth_admin;

--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


ALTER TABLE auth.sso_domains OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


ALTER TABLE auth.sso_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


ALTER TABLE auth.users OWNER TO supabase_auth_admin;

--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: Account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Account" (
    "userId" text NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    "providerAccountId" text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type text,
    scope text,
    id_token text,
    session_state text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Account" OWNER TO postgres;

--
-- Name: Admin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Admin" (
    id text NOT NULL,
    "userId" text NOT NULL,
    email text NOT NULL,
    username text,
    bio text,
    "imageUrl" text,
    department text,
    name text
);


ALTER TABLE public."Admin" OWNER TO postgres;

--
-- Name: Authenticator; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Authenticator" (
    "credentialID" text NOT NULL,
    "userId" text NOT NULL,
    "providerAccountId" text NOT NULL,
    "credentialPublicKey" text NOT NULL,
    counter integer NOT NULL,
    "credentialDeviceType" text NOT NULL,
    "credentialBackedUp" boolean NOT NULL,
    transports text
);


ALTER TABLE public."Authenticator" OWNER TO postgres;

--
-- Name: BeautyInfoPost; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BeautyInfoPost" (
    id integer NOT NULL,
    title text NOT NULL,
    images text[],
    file text NOT NULL,
    likes integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."BeautyInfoPost" OWNER TO postgres;

--
-- Name: BeautyInfoPostLike; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BeautyInfoPostLike" (
    id integer NOT NULL,
    "userEmail" text NOT NULL,
    "postId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."BeautyInfoPostLike" OWNER TO postgres;

--
-- Name: BeautyInfoPostLike_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."BeautyInfoPostLike_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."BeautyInfoPostLike_id_seq" OWNER TO postgres;

--
-- Name: BeautyInfoPostLike_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."BeautyInfoPostLike_id_seq" OWNED BY public."BeautyInfoPostLike".id;


--
-- Name: BeautyInfoPost_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."BeautyInfoPost_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."BeautyInfoPost_id_seq" OWNER TO postgres;

--
-- Name: BeautyInfoPost_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."BeautyInfoPost_id_seq" OWNED BY public."BeautyInfoPost".id;


--
-- Name: Client; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Client" (
    id text NOT NULL,
    "userId" text NOT NULL,
    email text NOT NULL,
    "emailVerified" timestamp(3) without time zone,
    username text,
    bio text,
    "imageUrl" text
);


ALTER TABLE public."Client" OWNER TO postgres;

--
-- Name: ClientPost; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ClientPost" (
    id text NOT NULL,
    title text NOT NULL,
    images text[],
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "clientId" text NOT NULL,
    content text NOT NULL
);


ALTER TABLE public."ClientPost" OWNER TO postgres;

--
-- Name: Comment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Comment" (
    id text NOT NULL,
    content text NOT NULL,
    "postId" text NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Comment" OWNER TO postgres;

--
-- Name: Feedback; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Feedback" (
    id text NOT NULL,
    rating integer NOT NULL,
    issues text[],
    comment text,
    email text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Feedback" OWNER TO postgres;

--
-- Name: PasswordResetToken; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PasswordResetToken" (
    token text NOT NULL,
    email text NOT NULL,
    expires timestamp(3) without time zone NOT NULL,
    id text NOT NULL
);


ALTER TABLE public."PasswordResetToken" OWNER TO postgres;

--
-- Name: PostLike; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PostLike" (
    id text NOT NULL,
    "postId" text NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."PostLike" OWNER TO postgres;

--
-- Name: PostTaggedProduct; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PostTaggedProduct" (
    id text NOT NULL,
    "postId" text NOT NULL,
    "productId" text NOT NULL
);


ALTER TABLE public."PostTaggedProduct" OWNER TO postgres;

--
-- Name: Product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Product" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    price double precision NOT NULL,
    category text NOT NULL,
    image text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    likes integer DEFAULT 0 NOT NULL,
    rank integer,
    rating double precision DEFAULT 0 NOT NULL,
    "reviewCount" integer DEFAULT 0 NOT NULL,
    subcategory text,
    tags text[],
    trending boolean DEFAULT false NOT NULL,
    votes integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."Product" OWNER TO postgres;

--
-- Name: ProductLike; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProductLike" (
    id text NOT NULL,
    "productId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userEmail" text NOT NULL
);


ALTER TABLE public."ProductLike" OWNER TO postgres;

--
-- Name: ProductVote; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProductVote" (
    id text NOT NULL,
    "productId" text NOT NULL,
    week integer,
    year integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userEmail" text NOT NULL
);


ALTER TABLE public."ProductVote" OWNER TO postgres;

--
-- Name: Review; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Review" (
    id text NOT NULL,
    content text,
    rating integer NOT NULL,
    images text[],
    "authorId" text NOT NULL,
    "productId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    metadata jsonb
);


ALTER TABLE public."Review" OWNER TO postgres;

--
-- Name: Session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Session" (
    "sessionToken" text NOT NULL,
    "userId" text NOT NULL,
    expires timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Session" OWNER TO postgres;

--
-- Name: Staff; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Staff" (
    id text NOT NULL,
    "userId" text NOT NULL,
    email text NOT NULL,
    username text,
    bio text,
    "imageUrl" text,
    department text,
    name text
);


ALTER TABLE public."Staff" OWNER TO postgres;

--
-- Name: Task; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Task" (
    id text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    "assignedTo" text NOT NULL,
    "dueDate" timestamp(3) without time zone NOT NULL,
    priority text NOT NULL,
    status text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Task" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "emailVerified" timestamp(3) without time zone,
    image text,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    password text,
    role public."Role" DEFAULT 'CLIENT'::public."Role" NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: UserRecommendation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserRecommendation" (
    id text NOT NULL,
    "userEmail" text NOT NULL,
    "productId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."UserRecommendation" OWNER TO postgres;

--
-- Name: VerificationToken; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."VerificationToken" (
    token text NOT NULL,
    expires timestamp(3) without time zone NOT NULL,
    _id text NOT NULL,
    email text NOT NULL
);


ALTER TABLE public."VerificationToken" OWNER TO postgres;

--
-- Name: _BeautyInfoPostLikeToUser; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_BeautyInfoPostLikeToUser" (
    "A" integer NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_BeautyInfoPostLikeToUser" OWNER TO postgres;

--
-- Name: _ProductVoteToUser; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_ProductVoteToUser" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_ProductVoteToUser" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


ALTER TABLE realtime.messages OWNER TO supabase_realtime_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE realtime.schema_migrations OWNER TO supabase_admin;

--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE realtime.subscription OWNER TO supabase_admin;

--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text
);


ALTER TABLE storage.buckets OWNER TO supabase_storage_admin;

--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE storage.migrations OWNER TO supabase_storage_admin;

--
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb
);


ALTER TABLE storage.objects OWNER TO supabase_storage_admin;

--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);


ALTER TABLE storage.s3_multipart_uploads OWNER TO supabase_storage_admin;

--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.s3_multipart_uploads_parts OWNER TO supabase_storage_admin;

--
-- Name: decrypted_secrets; Type: VIEW; Schema: vault; Owner: supabase_admin
--

CREATE VIEW vault.decrypted_secrets AS
 SELECT secrets.id,
    secrets.name,
    secrets.description,
    secrets.secret,
        CASE
            WHEN (secrets.secret IS NULL) THEN NULL::text
            ELSE
            CASE
                WHEN (secrets.key_id IS NULL) THEN NULL::text
                ELSE convert_from(pgsodium.crypto_aead_det_decrypt(decode(secrets.secret, 'base64'::text), 
                convert_to(((((secrets.id)::text || secrets.description) || (secrets.created_at)::text) || (secrets.updated_at)::text), 'utf8'::name), secrets.key_id, secrets.nonce),
                 'utf8'::name)
            END
        END AS decrypted_secret,
    secrets.key_id,
    secrets.nonce,
    secrets.created_at,
    secrets.updated_at
   FROM vault.secrets;


ALTER VIEW vault.decrypted_secrets OWNER TO supabase_admin;

--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Name: BeautyInfoPost id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BeautyInfoPost" ALTER COLUMN id SET DEFAULT nextval('public."BeautyInfoPost_id_seq"'::regclass);


--
-- Name: BeautyInfoPostLike id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BeautyInfoPostLike" ALTER COLUMN id SET DEFAULT nextval('public."BeautyInfoPostLike_id_seq"'::regclass);


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
00000000-0000-0000-0000-000000000000	23f0385d-af4e-4fce-ac71-b3153effe166	{"action":"user_confirmation_requested","actor_id":"d973b445-9236-435b-bfa0-95c85f33ade4","actor_username":"chrislynjules@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-01-22 18:37:01.469413+00	
00000000-0000-0000-0000-000000000000	1a4eb186-dde9-4b05-b955-c52a478b24f6	{"action":"user_confirmation_requested","actor_id":"b1581153-017b-484d-ba6d-ed873bee220c","actor_username":"chrislynjules27@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-01-22 18:42:41.18114+00	
00000000-0000-0000-0000-000000000000	c380a08e-d687-41ec-a3dd-b36909fad56e	{"action":"user_signedup","actor_id":"d973b445-9236-435b-bfa0-95c85f33ade4","actor_username":"chrislynjules@gmail.com","actor_via_sso":false,"log_type":"team"}	2025-01-22 18:45:26.06852+00	
00000000-0000-0000-0000-000000000000	e981d71e-be2e-43c8-9609-0c63f08132c4	{"action":"user_confirmation_requested","actor_id":"b1581153-017b-484d-ba6d-ed873bee220c","actor_username":"chrislynjules27@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-01-23 16:45:55.842306+00	
00000000-0000-0000-0000-000000000000	a2d86fd5-6278-4abe-95b0-9917b05c4df0	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"chrislynjules27@gmail.com","user_id":"b1581153-017b-484d-ba6d-ed873bee220c","user_phone":""}}	2025-01-24 15:03:11.515304+00	
00000000-0000-0000-0000-000000000000	843f8024-a1e1-4260-b583-ff6e10ec38bd	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"chrislynjules@gmail.com","user_id":"d973b445-9236-435b-bfa0-95c85f33ade4","user_phone":""}}	2025-01-24 15:03:11.620425+00	
00000000-0000-0000-0000-000000000000	53da9bec-aecb-4c9a-ac2b-99214b1be38b	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"chrislynjules@gmail.com","user_id":"c537e3be-8a8e-4612-8133-fcc96067da28","user_phone":""}}	2025-01-24 15:18:04.018724+00	
00000000-0000-0000-0000-000000000000	fcb2b6f3-8c7d-4026-adbe-55a2a2020dd3	{"action":"login","actor_id":"c537e3be-8a8e-4612-8133-fcc96067da28","actor_username":"chrislynjules@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-01-24 15:18:15.982857+00	
00000000-0000-0000-0000-000000000000	26bbb8a4-7617-4946-9b92-f8e2a7176465	{"action":"login","actor_id":"c537e3be-8a8e-4612-8133-fcc96067da28","actor_username":"chrislynjules@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-01-25 14:49:49.391423+00	
00000000-0000-0000-0000-000000000000	089e8a13-c551-4388-9797-7de4859e8cf5	{"action":"login","actor_id":"c537e3be-8a8e-4612-8133-fcc96067da28","actor_username":"chrislynjules@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-01-25 14:50:51.788982+00	
00000000-0000-0000-0000-000000000000	dd6a8539-ddb8-4c29-9ba4-a03986d31559	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"chrislynjules@gmail.com","user_id":"c537e3be-8a8e-4612-8133-fcc96067da28","user_phone":""}}	2025-01-25 14:51:20.55085+00	
00000000-0000-0000-0000-000000000000	92a030a2-7b13-47d3-947e-a50e4b3fb241	{"action":"user_confirmation_requested","actor_id":"5a7527e1-8e31-4260-b421-9409e19139f6","actor_username":"chrislynjules@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-01-25 15:24:42.016981+00	
00000000-0000-0000-0000-000000000000	f56f81e3-9a58-4473-b700-d196a3ece187	{"action":"user_confirmation_requested","actor_id":"8124c97d-8e52-4505-ac8b-a05672e3dbb1","actor_username":"chrislyn@graduate.utm.my","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-01-25 15:39:42.278712+00	
00000000-0000-0000-0000-000000000000	ce65175f-4a92-4ae5-997a-cf965d243676	{"action":"user_confirmation_requested","actor_id":"5a7527e1-8e31-4260-b421-9409e19139f6","actor_username":"chrislynjules@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-01-25 15:42:12.722928+00	
00000000-0000-0000-0000-000000000000	1853fe3b-45dd-4ea7-9619-88e864441662	{"action":"user_confirmation_requested","actor_id":"8124c97d-8e52-4505-ac8b-a05672e3dbb1","actor_username":"chrislyn@graduate.utm.my","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-01-25 15:58:24.114576+00	
00000000-0000-0000-0000-000000000000	813024b4-d015-46a8-8ef5-f95c89cbba01	{"action":"user_confirmation_requested","actor_id":"5a7527e1-8e31-4260-b421-9409e19139f6","actor_username":"chrislynjules@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-01-25 15:59:21.026619+00	
00000000-0000-0000-0000-000000000000	2c0cb2f3-4c31-4acf-9d55-8952ec90c9d3	{"action":"user_confirmation_requested","actor_id":"8124c97d-8e52-4505-ac8b-a05672e3dbb1","actor_username":"chrislyn@graduate.utm.my","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-01-25 16:01:32.326177+00	
00000000-0000-0000-0000-000000000000	1e42d8e2-d5f9-4d48-9537-76e05908496b	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"chrislynjules@gmail.com","user_id":"5a7527e1-8e31-4260-b421-9409e19139f6","user_phone":""}}	2025-01-25 16:11:26.147521+00	
00000000-0000-0000-0000-000000000000	b705e0c1-98fd-48d2-8a77-23ce47a20c22	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"chrislyn@graduate.utm.my","user_id":"8124c97d-8e52-4505-ac8b-a05672e3dbb1","user_phone":""}}	2025-01-25 16:11:26.305821+00	
00000000-0000-0000-0000-000000000000	7a25c72b-104e-4998-a003-3c749db6077b	{"action":"user_confirmation_requested","actor_id":"eb3633c1-c1b3-4462-ad72-c7b51b95da60","actor_username":"chrislynjules@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-01-25 16:31:05.782626+00	
00000000-0000-0000-0000-000000000000	3d312127-e1b2-4232-a196-d40783dde5e3	{"action":"user_confirmation_requested","actor_id":"060f483d-e10c-440a-a7ca-8c20ec33d843","actor_username":"chrislyn@graduate.utm.my","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-01-25 16:36:48.622861+00	
00000000-0000-0000-0000-000000000000	0b6b2cb7-2fdb-46d9-be4a-e28ab960c7a3	{"action":"user_confirmation_requested","actor_id":"eb3633c1-c1b3-4462-ad72-c7b51b95da60","actor_username":"chrislynjules@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-01-25 16:44:46.500453+00	
00000000-0000-0000-0000-000000000000	74f98490-1163-4a6c-9aa5-061c630f26da	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"chrislynjules@gmail.com","user_id":"eb3633c1-c1b3-4462-ad72-c7b51b95da60","user_phone":""}}	2025-01-25 16:53:13.741065+00	
00000000-0000-0000-0000-000000000000	a41f1731-6b6c-4486-94f2-7b5057ec8ff4	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"chrislyn@graduate.utm.my","user_id":"060f483d-e10c-440a-a7ca-8c20ec33d843","user_phone":""}}	2025-01-25 16:53:13.886497+00	
00000000-0000-0000-0000-000000000000	6e83455d-b814-409e-a326-6992467298e9	{"action":"user_signedup","actor_id":"286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5","actor_username":"chrislynjules@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-01-25 16:53:33.660669+00	
00000000-0000-0000-0000-000000000000	6f517771-5ba0-4b32-8535-87be5e06c9d4	{"action":"login","actor_id":"286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5","actor_username":"chrislynjules@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-01-25 16:53:33.668592+00	
00000000-0000-0000-0000-000000000000	ad189399-84a1-43af-94fd-203e87e43971	{"action":"login","actor_id":"286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5","actor_username":"chrislynjules@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-01-25 16:53:50.785431+00	
00000000-0000-0000-0000-000000000000	a3a3502f-89f2-48a8-bfc3-09ee27b029fb	{"action":"login","actor_id":"286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5","actor_username":"chrislynjules@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-01-25 16:53:57.218283+00	
00000000-0000-0000-0000-000000000000	92aadd09-20b9-4d26-99d1-c60e03c27c66	{"action":"login","actor_id":"286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5","actor_username":"chrislynjules@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-01-25 17:06:27.535231+00	
00000000-0000-0000-0000-000000000000	e365ea7d-da23-4975-8cb5-1f0ad9efca4a	{"action":"login","actor_id":"286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5","actor_username":"chrislynjules@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-01-25 17:06:58.456538+00	
00000000-0000-0000-0000-000000000000	21127c9b-5c20-44cc-9fac-e99812b15998	{"action":"login","actor_id":"286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5","actor_username":"chrislynjules@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-01-25 17:09:03.459233+00	
00000000-0000-0000-0000-000000000000	1a50f878-6789-47db-af75-4256a09adefa	{"action":"login","actor_id":"286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5","actor_username":"chrislynjules@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-01-25 17:10:07.717239+00	
00000000-0000-0000-0000-000000000000	28be1b14-56ce-4176-8821-401c13bea1f8	{"action":"login","actor_id":"286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5","actor_username":"chrislynjules@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-01-25 17:15:14.817555+00	
00000000-0000-0000-0000-000000000000	a9b8decb-c427-4d83-bedb-5dc7b808d9d4	{"action":"login","actor_id":"286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5","actor_username":"chrislynjules@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-01-25 17:19:27.821352+00	
00000000-0000-0000-0000-000000000000	23078e6d-cea8-40ec-b9bc-ae033bc551fb	{"action":"login","actor_id":"286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5","actor_username":"chrislynjules@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-01-25 17:19:46.45752+00	
00000000-0000-0000-0000-000000000000	38c10766-9057-4712-9ca4-cf7af943a5eb	{"action":"login","actor_id":"286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5","actor_username":"chrislynjules@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-01-25 17:20:11.20662+00	
00000000-0000-0000-0000-000000000000	db4c4aa7-a35f-4aee-82b3-3a6122a95858	{"action":"login","actor_id":"286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5","actor_username":"chrislynjules@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-01-25 17:27:12.414175+00	
00000000-0000-0000-0000-000000000000	3600bf90-a274-4549-9747-e185914d57b9	{"action":"login","actor_id":"286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5","actor_username":"chrislynjules@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-01-25 17:29:00.06111+00	
00000000-0000-0000-0000-000000000000	ebb9a049-5153-41af-9105-2348091beea0	{"action":"login","actor_id":"286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5","actor_username":"chrislynjules@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-01-25 17:29:21.181754+00	
00000000-0000-0000-0000-000000000000	006e35da-5b37-4195-9836-b6b49d8d03ee	{"action":"login","actor_id":"286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5","actor_username":"chrislynjules@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-01-25 17:43:53.951672+00	
00000000-0000-0000-0000-000000000000	c4f235b0-e535-4147-acc9-fac2a6e68e4a	{"action":"login","actor_id":"286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5","actor_username":"chrislynjules@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-01-25 17:44:08.71046+00	
00000000-0000-0000-0000-000000000000	c93c4336-6e72-4e64-aca4-39382f9ad8d1	{"action":"login","actor_id":"286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5","actor_username":"chrislynjules@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-01-25 17:44:09.76614+00	
00000000-0000-0000-0000-000000000000	ac54f96e-176a-4d38-a72f-7b4f1e74ea05	{"action":"login","actor_id":"286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5","actor_username":"chrislynjules@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-01-25 17:45:35.065551+00	
00000000-0000-0000-0000-000000000000	57f95535-de22-4968-85e0-02fd35427d76	{"action":"login","actor_id":"286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5","actor_username":"chrislynjules@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-01-25 18:00:59.582293+00	
00000000-0000-0000-0000-000000000000	74025215-ae76-43f3-b797-0ca23c073f2b	{"action":"login","actor_id":"286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5","actor_username":"chrislynjules@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-01-25 18:01:55.37815+00	
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at) FROM stdin;
f95d40f2-8f7c-4688-a006-2c47476d34c3	b1581153-017b-484d-ba6d-ed873bee220c	733375f5-5e83-4fb0-a861-452ce823fca4	s256	TDZiAtISWZOC3jHHUKm1uz4gUv7Uj_1Px6-yvaigo5w	email			2025-01-22 18:42:41.181894+00	2025-01-22 18:42:41.181894+00	email/signup	\N
317ff7e9-35db-4a1f-8596-37cfd9f84748	d973b445-9236-435b-bfa0-95c85f33ade4	ac11c9ee-ba85-49a1-ad44-5337d189b9a6	s256	TCona952qNxmS1oo6mrdplfLO1HDygwLi4GPVmLNCAo	email			2025-01-22 18:37:01.472979+00	2025-01-22 18:45:26.094661+00	email/signup	2025-01-22 18:45:26.094609+00
07e5ef7a-6837-4e05-a599-381342877a77	b1581153-017b-484d-ba6d-ed873bee220c	408b9e86-4841-4bdc-8fa4-29d065a238be	s256	7YYk6K5FZGsHYQW3LDzzFNDPShtGjaQ0i0VSDJCLJGk	email			2025-01-23 16:45:55.842989+00	2025-01-23 16:45:55.842989+00	email/signup	\N
34233f50-a9fa-49a7-a40f-5846bb552240	5a7527e1-8e31-4260-b421-9409e19139f6	921655dc-cc16-4f44-8336-6ebe6bcaf05d	s256	sKuYAyKfmimJL82kYt7UwyFt2Xni1IxmvS93FkbrBJQ	email			2025-01-25 15:24:42.019187+00	2025-01-25 15:24:42.019187+00	email/signup	\N
fcdd8d82-aba6-4f6c-a74d-ed7c084dcc38	8124c97d-8e52-4505-ac8b-a05672e3dbb1	dcf36e75-8822-4f53-bcc6-a4f2d0af88f8	s256	rfruw1oMHDM-XsH9L6nOaypXHJag5nx4NQoZRPLYWLs	email			2025-01-25 15:39:42.279401+00	2025-01-25 15:39:42.279401+00	email/signup	\N
c9b604fb-1f86-45c1-b85a-79b9ee93d738	5a7527e1-8e31-4260-b421-9409e19139f6	f1f4c8c0-219b-4c47-8b92-d40eca6d84de	s256	NsRnjOwVjZl2jUQ4ij1qxmH-gJ7XSeQVcbDE9F8owLs	email			2025-01-25 15:42:12.723889+00	2025-01-25 15:42:12.723889+00	email/signup	\N
b7017713-0fa0-4cba-bd08-a23ef6d4cdcf	8124c97d-8e52-4505-ac8b-a05672e3dbb1	032c9148-22f4-4f5f-a6dc-8279b0f53e2d	s256	JW6KIXNkqhmj75WyBuf-veGnAWn4HJNe9h-yYZF9ZmA	email			2025-01-25 15:58:24.115496+00	2025-01-25 15:58:24.115496+00	email/signup	\N
44488e62-bb43-440b-a20e-d2962a1026ab	5a7527e1-8e31-4260-b421-9409e19139f6	14923f6e-6639-4ee2-b9c0-18736b63d8e7	s256	AVy3bWXcvZMZMqfw4GeaLL1XnRDK5w7DDJAI6-4s6Rk	email			2025-01-25 15:59:21.027398+00	2025-01-25 15:59:21.027398+00	email/signup	\N
41b1db23-5a21-4799-a3bf-14ac26b5f20f	8124c97d-8e52-4505-ac8b-a05672e3dbb1	cb471042-f41c-4c23-bfaf-d5b4e7309088	s256	_X3LDXA8kLIVugxiNoT6DQIwswf-0gYAOT1AXoJ3RcE	email			2025-01-25 16:01:32.327206+00	2025-01-25 16:01:32.327206+00	email/signup	\N
b9c11cc4-7fce-432f-ba39-228cf0231a51	eb3633c1-c1b3-4462-ad72-c7b51b95da60	508eb7b2-e26b-4d47-a6fe-d45ecaf5d6cb	s256	IpQSGb0yBtgacCYHxVXjoFC-Q9_yI5eJ7tEcyX14alY	email			2025-01-25 16:31:05.783378+00	2025-01-25 16:31:05.783378+00	email/signup	\N
3fe9d1cf-f733-47ab-9a91-53218a898397	060f483d-e10c-440a-a7ca-8c20ec33d843	152fd455-2214-487e-9c42-8aab4f4b59fb	s256	yrAXCVaxzo0Cjjog2rf45Vn_OteF8XNTllN-Etr8eVk	email			2025-01-25 16:36:48.623667+00	2025-01-25 16:36:48.623667+00	email/signup	\N
d8aa7514-bcc5-4d0c-9663-76423e894f87	eb3633c1-c1b3-4462-ad72-c7b51b95da60	2f1ac95b-14da-4ffc-ad21-c3526bd0936d	s256	c6C1TIF51oT2teRvjYEEI522hjXLRDV2TfiGOuYzx4g	email			2025-01-25 16:44:46.501503+00	2025-01-25 16:44:46.501503+00	email/signup	\N
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5	286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5	{"sub": "286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5", "email": "chrislynjules@gmail.com", "email_verified": false, "phone_verified": false}	email	2025-01-25 16:53:33.657996+00	2025-01-25 16:53:33.658053+00	2025-01-25 16:53:33.658053+00	cc9f33ee-c92c-4c2d-a6ee-1cb8d7f51185
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
7058a7a6-7a89-4c61-8043-bfbdd1d3cb83	2025-01-25 16:53:33.672006+00	2025-01-25 16:53:33.672006+00	password	063aa933-6136-4dc9-93ee-4b489ab56d84
623a262a-f2c9-45e4-a5c7-d453e016f469	2025-01-25 16:53:50.790358+00	2025-01-25 16:53:50.790358+00	password	44c4079c-c318-4e7e-aa7c-922446708dbb
dd3ee158-f714-4cb5-812e-aaf62a978bde	2025-01-25 16:53:57.222274+00	2025-01-25 16:53:57.222274+00	password	aa0a05c3-3de4-4a08-98a5-c4cd0efc43eb
f11d57aa-6f8d-4765-be0e-ee1cadb0e8dd	2025-01-25 17:06:27.539318+00	2025-01-25 17:06:27.539318+00	password	1d21e1aa-f192-4cd3-8ee9-0722fab8bc89
c435af8f-f913-4413-a82a-52d4ae4a037a	2025-01-25 17:06:58.45942+00	2025-01-25 17:06:58.45942+00	password	40445ed4-8dab-497e-ab76-403e387eef8c
0f9d1d2e-ce30-4926-95d6-86a62801c9f7	2025-01-25 17:09:03.463652+00	2025-01-25 17:09:03.463652+00	password	415b31fd-d4ba-4d44-81d2-3ddc0a9e3fe0
5e86e5f7-9496-4773-9c18-5208d9116caf	2025-01-25 17:10:07.724704+00	2025-01-25 17:10:07.724704+00	password	5b12c929-4fdb-409a-bd1b-0d187738250f
4c56f05f-921a-4615-8224-96aaf4291843	2025-01-25 17:15:14.822316+00	2025-01-25 17:15:14.822316+00	password	c4a492ad-7737-40fa-af9b-8360d5a0610f
8e86c29c-c2dd-4cde-8a00-868b30fd171a	2025-01-25 17:19:27.82582+00	2025-01-25 17:19:27.82582+00	password	445895b7-83f3-4570-853d-2853a74d8fd1
2ac7d52d-95f0-49b7-b92e-075412f6867f	2025-01-25 17:19:46.460219+00	2025-01-25 17:19:46.460219+00	password	88f7ed76-d9e9-416d-8532-c6039789ccd4
49ff9e3c-049a-41e2-977c-e9bcff5bd629	2025-01-25 17:20:11.209401+00	2025-01-25 17:20:11.209401+00	password	ddf04cca-e125-4d27-93c5-076767cc3af2
19f433fb-79a9-418c-a46e-9139738f4f58	2025-01-25 17:27:12.419393+00	2025-01-25 17:27:12.419393+00	password	f60f1892-d9cb-435c-8685-60b29b778749
3010e50c-6396-4126-a51f-5fb9457ec72d	2025-01-25 17:29:00.065583+00	2025-01-25 17:29:00.065583+00	password	c3197e4d-d46f-4f48-aa9e-cee48772497f
13577f5e-3c68-4372-a420-04c606774f1b	2025-01-25 17:29:21.18445+00	2025-01-25 17:29:21.18445+00	password	69792322-de6b-42a9-a86c-5e1b2a0cb92f
4906325e-bdf9-49e6-9ea4-20aca00da972	2025-01-25 17:43:53.956659+00	2025-01-25 17:43:53.956659+00	password	e965f43f-9106-4f74-99e8-569aafa6bf2e
3f4d0f44-b193-41a7-8752-2189e8e53af8	2025-01-25 17:44:08.713164+00	2025-01-25 17:44:08.713164+00	password	f717af2b-5986-4ec9-90f8-1de397d83eb4
329e5315-5999-4b21-a1db-7a2ca40f37d2	2025-01-25 17:44:09.769098+00	2025-01-25 17:44:09.769098+00	password	4945bd80-c82a-4246-b4a7-56b68b2ff2b4
8a56de0a-a093-4574-b985-964d5f543cab	2025-01-25 17:45:35.070645+00	2025-01-25 17:45:35.070645+00	password	c80a78f8-136d-474b-81c7-858d29569db4
2683461e-7f1c-4e27-8fee-21a4c9c3c6a9	2025-01-25 18:00:59.586753+00	2025-01-25 18:00:59.586753+00	password	6f37f446-e331-452d-8b0d-32106ba8183f
cb07f6db-5b00-4405-a9de-8fd05c78cdd6	2025-01-25 18:01:55.380811+00	2025-01-25 18:01:55.380811+00	password	8a2503a0-17b6-4966-acc3-639082139086
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid) FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
00000000-0000-0000-0000-000000000000	4	LWOGHTiMidDk68asbVZwiA	286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5	f	2025-01-25 16:53:33.670154+00	2025-01-25 16:53:33.670154+00	\N	7058a7a6-7a89-4c61-8043-bfbdd1d3cb83
00000000-0000-0000-0000-000000000000	5	BLtRfam-o1OzMkTkEp1ueQ	286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5	f	2025-01-25 16:53:50.7889+00	2025-01-25 16:53:50.7889+00	\N	623a262a-f2c9-45e4-a5c7-d453e016f469
00000000-0000-0000-0000-000000000000	6	x0hyhKngvjjTju5V9Z0Vvg	286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5	f	2025-01-25 16:53:57.220405+00	2025-01-25 16:53:57.220405+00	\N	dd3ee158-f714-4cb5-812e-aaf62a978bde
00000000-0000-0000-0000-000000000000	7	eZVyTi0_--Mfeb-2CKVhaw	286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5	f	2025-01-25 17:06:27.537403+00	2025-01-25 17:06:27.537403+00	\N	f11d57aa-6f8d-4765-be0e-ee1cadb0e8dd
00000000-0000-0000-0000-000000000000	8	UuwqqtpR54ixCkGKHxlbHw	286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5	f	2025-01-25 17:06:58.458105+00	2025-01-25 17:06:58.458105+00	\N	c435af8f-f913-4413-a82a-52d4ae4a037a
00000000-0000-0000-0000-000000000000	9	2V84qz87jrJwQhIYD9vt7Q	286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5	f	2025-01-25 17:09:03.46154+00	2025-01-25 17:09:03.46154+00	\N	0f9d1d2e-ce30-4926-95d6-86a62801c9f7
00000000-0000-0000-0000-000000000000	10	G45oMHdPAweTcsU6mT_CCw	286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5	f	2025-01-25 17:10:07.720943+00	2025-01-25 17:10:07.720943+00	\N	5e86e5f7-9496-4773-9c18-5208d9116caf
00000000-0000-0000-0000-000000000000	11	YnefLqsmjJivgJWMmpEKhg	286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5	f	2025-01-25 17:15:14.820046+00	2025-01-25 17:15:14.820046+00	\N	4c56f05f-921a-4615-8224-96aaf4291843
00000000-0000-0000-0000-000000000000	12	uUc-XlWfa6DtHmR_aeJxQA	286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5	f	2025-01-25 17:19:27.823787+00	2025-01-25 17:19:27.823787+00	\N	8e86c29c-c2dd-4cde-8a00-868b30fd171a
00000000-0000-0000-0000-000000000000	13	xUhLjWPCPlcMxZiXJZb3mQ	286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5	f	2025-01-25 17:19:46.458986+00	2025-01-25 17:19:46.458986+00	\N	2ac7d52d-95f0-49b7-b92e-075412f6867f
00000000-0000-0000-0000-000000000000	14	7scAK2Ky_tPAmR5_aDNMUQ	286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5	f	2025-01-25 17:20:11.208102+00	2025-01-25 17:20:11.208102+00	\N	49ff9e3c-049a-41e2-977c-e9bcff5bd629
00000000-0000-0000-0000-000000000000	15	8Yn1j81LMKH7P2YmbZkeNg	286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5	f	2025-01-25 17:27:12.41717+00	2025-01-25 17:27:12.41717+00	\N	19f433fb-79a9-418c-a46e-9139738f4f58
00000000-0000-0000-0000-000000000000	16	Jgh6tLsIx_6cyVh_skk2rQ	286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5	f	2025-01-25 17:29:00.063608+00	2025-01-25 17:29:00.063608+00	\N	3010e50c-6396-4126-a51f-5fb9457ec72d
00000000-0000-0000-0000-000000000000	17	7cKKtq9mTRj3AZo7LnXAqQ	286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5	f	2025-01-25 17:29:21.183232+00	2025-01-25 17:29:21.183232+00	\N	13577f5e-3c68-4372-a420-04c606774f1b
00000000-0000-0000-0000-000000000000	18	XAwyniZsrmweRdjdC2eaxA	286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5	f	2025-01-25 17:43:53.95452+00	2025-01-25 17:43:53.95452+00	\N	4906325e-bdf9-49e6-9ea4-20aca00da972
00000000-0000-0000-0000-000000000000	19	ECeWnDVaGl8xJ62YnX1G1g	286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5	f	2025-01-25 17:44:08.711953+00	2025-01-25 17:44:08.711953+00	\N	3f4d0f44-b193-41a7-8752-2189e8e53af8
00000000-0000-0000-0000-000000000000	20	OVSIy0UOKo-eLHa3ePS-QA	286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5	f	2025-01-25 17:44:09.767747+00	2025-01-25 17:44:09.767747+00	\N	329e5315-5999-4b21-a1db-7a2ca40f37d2
00000000-0000-0000-0000-000000000000	21	LTbLCVWA-DFuQ6wzKj0sJA	286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5	f	2025-01-25 17:45:35.067921+00	2025-01-25 17:45:35.067921+00	\N	8a56de0a-a093-4574-b985-964d5f543cab
00000000-0000-0000-0000-000000000000	22	xcroS0qT5CZuzxZNRbjx4A	286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5	f	2025-01-25 18:00:59.584619+00	2025-01-25 18:00:59.584619+00	\N	2683461e-7f1c-4e27-8fee-21a4c9c3c6a9
00000000-0000-0000-0000-000000000000	23	gI6ZCsnZ5a0GeQiF3DFNBQ	286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5	f	2025-01-25 18:01:55.379572+00	2025-01-25 18:01:55.379572+00	\N	cb07f6db-5b00-4405-a9de-8fd05c78cdd6
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag) FROM stdin;
7058a7a6-7a89-4c61-8043-bfbdd1d3cb83	286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5	2025-01-25 16:53:33.669195+00	2025-01-25 16:53:33.669195+00	\N	aal1	\N	\N	node	161.139.154.44	\N
623a262a-f2c9-45e4-a5c7-d453e016f469	286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5	2025-01-25 16:53:50.788088+00	2025-01-25 16:53:50.788088+00	\N	aal1	\N	\N	node	161.139.154.44	\N
dd3ee158-f714-4cb5-812e-aaf62a978bde	286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5	2025-01-25 16:53:57.219579+00	2025-01-25 16:53:57.219579+00	\N	aal1	\N	\N	node	161.139.154.44	\N
f11d57aa-6f8d-4765-be0e-ee1cadb0e8dd	286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5	2025-01-25 17:06:27.53627+00	2025-01-25 17:06:27.53627+00	\N	aal1	\N	\N	node	161.139.154.44	\N
c435af8f-f913-4413-a82a-52d4ae4a037a	286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5	2025-01-25 17:06:58.457333+00	2025-01-25 17:06:58.457333+00	\N	aal1	\N	\N	node	161.139.154.44	\N
0f9d1d2e-ce30-4926-95d6-86a62801c9f7	286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5	2025-01-25 17:09:03.460335+00	2025-01-25 17:09:03.460335+00	\N	aal1	\N	\N	node	161.139.154.44	\N
5e86e5f7-9496-4773-9c18-5208d9116caf	286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5	2025-01-25 17:10:07.71894+00	2025-01-25 17:10:07.71894+00	\N	aal1	\N	\N	node	161.139.154.44	\N
4c56f05f-921a-4615-8224-96aaf4291843	286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5	2025-01-25 17:15:14.818831+00	2025-01-25 17:15:14.818831+00	\N	aal1	\N	\N	node	161.139.154.44	\N
8e86c29c-c2dd-4cde-8a00-868b30fd171a	286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5	2025-01-25 17:19:27.82256+00	2025-01-25 17:19:27.82256+00	\N	aal1	\N	\N	node	161.139.154.44	\N
2ac7d52d-95f0-49b7-b92e-075412f6867f	286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5	2025-01-25 17:19:46.458289+00	2025-01-25 17:19:46.458289+00	\N	aal1	\N	\N	node	161.139.154.44	\N
49ff9e3c-049a-41e2-977c-e9bcff5bd629	286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5	2025-01-25 17:20:11.207392+00	2025-01-25 17:20:11.207392+00	\N	aal1	\N	\N	node	161.139.154.44	\N
19f433fb-79a9-418c-a46e-9139738f4f58	286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5	2025-01-25 17:27:12.415289+00	2025-01-25 17:27:12.415289+00	\N	aal1	\N	\N	node	161.139.154.44	\N
3010e50c-6396-4126-a51f-5fb9457ec72d	286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5	2025-01-25 17:29:00.062173+00	2025-01-25 17:29:00.062173+00	\N	aal1	\N	\N	node	161.139.154.44	\N
13577f5e-3c68-4372-a420-04c606774f1b	286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5	2025-01-25 17:29:21.182526+00	2025-01-25 17:29:21.182526+00	\N	aal1	\N	\N	node	161.139.154.44	\N
4906325e-bdf9-49e6-9ea4-20aca00da972	286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5	2025-01-25 17:43:53.952778+00	2025-01-25 17:43:53.952778+00	\N	aal1	\N	\N	node	161.139.154.44	\N
3f4d0f44-b193-41a7-8752-2189e8e53af8	286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5	2025-01-25 17:44:08.711235+00	2025-01-25 17:44:08.711235+00	\N	aal1	\N	\N	node	161.139.154.44	\N
329e5315-5999-4b21-a1db-7a2ca40f37d2	286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5	2025-01-25 17:44:09.766998+00	2025-01-25 17:44:09.766998+00	\N	aal1	\N	\N	node	161.139.154.44	\N
8a56de0a-a093-4574-b985-964d5f543cab	286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5	2025-01-25 17:45:35.0667+00	2025-01-25 17:45:35.0667+00	\N	aal1	\N	\N	node	161.139.154.44	\N
2683461e-7f1c-4e27-8fee-21a4c9c3c6a9	286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5	2025-01-25 18:00:59.583422+00	2025-01-25 18:00:59.583422+00	\N	aal1	\N	\N	node	161.139.154.44	\N
cb07f6db-5b00-4405-a9de-8fd05c78cdd6	286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5	2025-01-25 18:01:55.378891+00	2025-01-25 18:01:55.378891+00	\N	aal1	\N	\N	node	161.139.154.44	\N
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
00000000-0000-0000-0000-000000000000	286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5	authenticated	authenticated	chrislynjules@gmail.com	$2a$10$pT0wUPXN22nb4ErqplkpfOjk4YKqHmmYBcXLXZgol5GjXh/lnqlu.	2025-01-25 16:53:33.661165+00	\N		\N		\N			\N	2025-01-25 18:01:55.378815+00	{"provider": "email", "providers": ["email"]}	{"sub": "286c8fc1-d4b5-4ea1-97b6-4f6c586b82a5", "email": "chrislynjules@gmail.com", "email_verified": true, "phone_verified": false}	\N	2025-01-25 16:53:33.651383+00	2025-01-25 18:01:55.380477+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: supabase_admin
--

COPY pgsodium.key (id, status, created, expires, key_type, key_id, key_context, name, associated_data, raw_key, raw_key_nonce, parent_key, comment, user_data) FROM stdin;
\.


--
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Account" ("userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Admin; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Admin" (id, "userId", email, username, bio, "imageUrl", department, name) FROM stdin;
cm7z6253b0008vfp8kavh9bz3	cm7z6250b0006vfp89trd61kr	chrislyn@graduate.utm.my	Innisfree Admin..		
https://utfs.io/f/1FoZQ83TdBfOVpZJ9btYkoRTmIaOUZu3x1qplKz6H7Ct5n0B	\N	\N
\.


--
-- Data for Name: Authenticator; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Authenticator" ("credentialID", "userId", "providerAccountId", "credentialPublicKey", counter, "credentialDeviceType", "credentialBackedUp", transports) FROM stdin;
\.


--
-- Data for Name: BeautyInfoPost; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BeautyInfoPost" (id, title, images, file, likes, "createdAt", "updatedAt") FROM stdin;
22	🌸 My Innisfree Glow-Up Routine ✨ 🌸	{https://utfs.io/f/1FoZQ83TdBfOiIldBQSHUTICseJgzQr6P49joSkxcph5tNGF}	https://utfs.io/f/1FoZQ83TdBfOLY83CBpjvrqg0CzifX1b2TB9HFYcWNSAlmJP	1	2025-04-16 12:13:01.927	2025-04-18 20:00:27.832
27	Pore Care Routine with Innisfree	{https://utfs.io/f/1FoZQ83TdBfOwZ9nG561qeIp24EF3dKBXVC5cnvufMGhmlJo}	https://utfs.io/f/1FoZQ83TdBfOGeqisjEV7Yp1JmNnHoLDAMhWsOcKduvUP9al	1	2025-04-16 12:42:21.05	2025-04-16 12:54:25.013
26	💫 “Minimalist Skincare for Busy Babes” 💫	{https://utfs.io/f/1FoZQ83TdBfOdxcczqtHwW3scK4tj7uN5hzG216AFgEVIMUi}	https://utfs.io/f/1FoZQ83TdBfOT9cEyv4UWav0QJgXB6I8CupH4OrKloANtEkd	1	2025-04-16 12:40:57.03	2025-04-16 12:54:25.968
25	🌿 “Skincare Secrets Straight from Jeju” 🌿	{https://utfs.io/f/1FoZQ83TdBfONzKcsAPFnmtBWw8UvXgehZGAIysVf5CcxDNr}	https://utfs.io/f/1FoZQ83TdBfO0x0pMqsbWV4FBlmvu8H2U1nS6YPqrwpDZOJI	1	2025-04-16 12:39:50.005	2025-04-16 12:54:26.771
21	🌿✨ Discover the Magic of Innisfree ✨🌿	{https://utfs.io/f/1FoZQ83TdBfOxSpWSBnHj4FRsiCh5SYy0vD3NrwfeaLl9O61}	https://utfs.io/f/1FoZQ83TdBfOlxxA83p5BFmA9oCDxOe5XYT7Hca2n6UWSyZf	3	2025-04-16 11:47:37.011	2025-04-18 19:51:53.191
\.


--
-- Data for Name: BeautyInfoPostLike; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BeautyInfoPostLike" (id, "userEmail", "postId", "createdAt") FROM stdin;
106	lokyuxuan@gmail.com	21	2025-04-16 11:48:46.143
107	lokyuxuan@gmail.com	22	2025-04-16 12:21:55.634
108	syafiqzulfadhli@graduate.utm.my	21	2025-04-16 12:31:34.441
109	syafiqzulfadhli099@gmail.com	21	2025-04-16 12:35:07.508
111	lokyuxuan@gmail.com	27	2025-04-16 12:54:24.573
112	lokyuxuan@gmail.com	26	2025-04-16 12:54:25.525
113	lokyuxuan@gmail.com	25	2025-04-16 12:54:26.32
\.


--
-- Data for Name: Client; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Client" (id, "userId", email, "emailVerified", username, bio, "imageUrl") FROM stdin;
cm9h9k5z20006vf8s1i1y8bce	cm9h9k5v90004vf8s4c73ya1s	copimi@azuretechtalk.net	2025-04-14 16:04:11.271			
cm9jt24am0002vfa0mptv4104	cm9jt243r0000vfa0yrskatz3	1tian@ptct.net	2025-04-16 10:45:37.04			
cm85q5c1z0003dzu8zpt8f591	cm85q5but0001dzu82uuvvdas	lokyuxuan@gmail.com	2025-03-12 17:39:10.12	Xuan	I am Blue Cat ^^	https://utfs.io/f/1FoZQ83TdBfOuKk9TalAcg5mfGEqBX80VFLd9oDJnTWj3wtU
cm8pjvvvc0003wqx412phtsve	cm8pjvvn90001wqx4fdxyhr1k	syafiqzulfadhli099@gmail.com	2025-04-11 19:55:52.121	sy	busy	https://utfs.io/f/1FoZQ83TdBfOng1NDTcrH7sLStjVDzyBX9YMoF6QU8lE1Pb2
cm9jwevlb0002l504r30x8qts	cm9jweuqg0000l50475qp0gjw	yenaf76817@ovobri.com	\N			
cm9jwonfg0002l204kzwzepuc	cm9jwoml90000l204fa4spb9h	88me5@ptct.net	\N			
cm9jwt4w10005l504vpejhm1u	cm9jwt41t0003l5045cohso2u	syafiqzulfadhli@graduate.utm.my	2025-04-16 12:30:49.241			
cm9jwxszc0002jy04h49fqzdy	cm9jwxs4a0000jy0434wkk67u	cm02k@ptct.net	\N			
cm7z5y2ul0002vfp8m7fcr21l	cm7z5y2ro0000vfp898cdqhoa	chrislynjules@gmail.com	2025-04-12 14:40:46.079	lyn Clientss	yessiraa	https://utfs.io/f/1FoZQ83TdBfOsAXeOIdSRbs6hCA5cqJa2HY93mZegQ087rMn
\.


--
-- Data for Name: ClientPost; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ClientPost" (id, title, images, "createdAt", "updatedAt", "clientId", content) FROM stdin;
cm9jpwci80001wq3o8mvuqixu	New Post	{https://utfs.io/f/1FoZQ83TdBfOWdNeQ8Y0Y2HRGSMTapjqBONfmx7v8I1EyLdC,https://utfs.io/f/1FoZQ83TdBfOhmBy6RgvL8ZUH6l2ImTjAueVzhOtnDdJpWbY}	2025-04-16 09:16:48.076	2025-04-16 09:16:48.076	cm7z5y2ul0002vfp8m7fcr21l	test
cm9jtx2rp000gvfa0iwl02vss	New Post	{https://utfs.io/f/1FoZQ83TdBfOFyyePUE8d7CU2kEenb3ZgzVp6OscrT9vKNHq}	2025-04-16 11:09:20.573	2025-04-16 11:09:20.573	cm7z5y2ul0002vfp8m7fcr21l	I love this product so much
cm9jwmwfs0001l804ne1nh7kt	New Post	{https://utfs.io/f/1FoZQ83TdBfOkJaXfHIGWJz8IrPiuXMUxsd6yqDYtlpbV1F0}	2025-04-16 12:25:24.664	2025-04-16 12:25:24.664	cm85q5c1z0003dzu8zpt8f591	love this one <3
cm9jxnapo0001ie04d6gtijwf	New Post	{https://utfs.io/f/1FoZQ83TdBfOBGiMcjNmi9rs04KG37XkxvOCTJUS5mgjIHAq,https://utfs.io/f/1FoZQ83TdBfO6SPb5roivtOjhoGAcy286Ps0mBaFXQqKuxnb}	2025-04-16 12:53:42.78	2025-04-16 12:53:42.78	cm7z5y2ul0002vfp8m7fcr21l	
cm9jxom270001lg0akeulu2s3	New Post	{https://utfs.io/f/1FoZQ83TdBfOvki1nkBsJQRGehoxqNAmrU8C1tOPDkudf9Kb}	2025-04-16 12:54:44.143	2025-04-16 12:54:44.143	cm7z5y2ul0002vfp8m7fcr21l	Look how glowy my skin is!
\.


--
-- Data for Name: Comment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Comment" (id, content, "postId", "userId", "createdAt", "updatedAt") FROM stdin;
cm9jwetvu0008jv04jkf2gijh	Love this product as well <3	cm9jtx2rp000gvfa0iwl02vss	cm85q5but0001dzu82uuvvdas	2025-04-16 12:19:08.107	2025-04-16 12:19:08.107
cm9jxnofr0005ie04ylgeeh2n	Nice product	cm9jpwci80001wq3o8mvuqixu	cm85q5but0001dzu82uuvvdas	2025-04-16 12:54:00.567	2025-04-16 12:54:00.567
cm9jxqv9c000die04vkykuck3	Love this yayaaaaa	cm9jxnapo0001ie04d6gtijwf	cm85q5but0001dzu82uuvvdas	2025-04-16 12:56:29.376	2025-04-16 12:56:29.376
cm9jxtkwv000jie04favf6jk4	Just chill ya	cm9jxom270001lg0akeulu2s3	cm85q5but0001dzu82uuvvdas	2025-04-16 12:58:35.723	2025-04-16 12:58:35.723
\.


--
-- Data for Name: Feedback; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Feedback" (id, rating, issues, comment, email, "createdAt", "updatedAt") FROM stdin;
cm7z6ga5n000cvfp8itlpmj4n	5	{"Application bugs"}	Have Bugs	chrislynjules@gmail.com	2025-03-07 19:37:19.683	2025-03-07 19:37:19.683
cm7z6lswz000dvfp881lblgfh	1	{"Customer service","Bad navigation"}	Have Problem	chrislynjules@gmail.com	2025-03-07 19:41:37.293	2025-03-07 19:41:37.293
cm85q2m0b0000dzu8jpx669oi	1	{"Application bugs","Slow loading","Visual functionality","Bad navigation","Other problems","Customer service"}	Test	chrislynjules@gmail.com	2025-03-12 09:33:11.467	2025-03-12 09:33:11.467
cm85qagvz0004dzu8bbcmuzg7	5	{"Application bugs"}	Doing good, continue the good workヾ(•ω•`)o	lokyuxuan@gmail.com	2025-03-12 09:39:18.096	2025-03-12 09:39:18.096
cm863q9qy0001wqucgovlfv2e	3	{"Application bugs"}		chrislynjules@gmail.com	2025-03-12 15:55:29.863	2025-03-12 15:55:29.863
cm8650tvi0000vfh4wols8l7p	5	{"Bad navigation"}		chrislynjules@gmail.com	2025-03-12 16:31:42.602	2025-03-12 16:31:42.602
cm866uz5f0000wq1gd5lekvij	4	{}		chrislynjules@gmail.com	2025-03-12 17:23:08.534	2025-03-12 17:23:08.534
cm86ouc3u0006vfccc3ic1tr1	4	{}		chrislynjules@gmail.com	2025-03-13 01:46:32.007	2025-03-13 01:46:32.007
cm86ouji10007vfcc1jr6ntyy	4	{"Application bugs"}	You have bugs	chrislynjules@gmail.com	2025-03-13 01:46:41.575	2025-03-13 01:46:41.575
cm86q26b10000vf4gxjcngxho	3	{}		chrislynjules@gmail.com	2025-03-13 02:20:37.335	2025-03-13 02:20:37.335
cm86q2fsr0001vf4g1jqd0swt	3	{"Customer service","Bad navigation"}	Got bugs	chrislynjules@gmail.com	2025-03-13 02:20:49.659	2025-03-13 02:20:49.659
cm94e0ipl0006vfd8syyc7nao	5	{}		vau9m@ptct.net	2025-04-05 15:47:34.459	2025-04-05 15:47:34.459
cm94e0vo90007vfd8svrz92jm	3	{"Slow loading"}	UHm its very slow and a lot of loading	vau9m@ptct.net	2025-04-05 15:47:51.493	2025-04-05 15:47:51.493
cm94iw40x0000vfr8q9cbghcn	5	{}		chrislynjules@gmail.com	2025-04-05 18:04:07.116	2025-04-05 18:04:07.116
cm9622zhh0004vfz0141x1r4g	5	{}		chrislynjules@gmail.com	2025-04-06 19:49:06.698	2025-04-06 19:49:06.698
cm962wzax000hvfz05zbiu7bw	1	{"Application bugs"}		8i7eh@ptct.net	2025-04-06 20:12:24.55	2025-04-06 20:12:24.55
cm9bt04y7000bvf5glma4h9d3	5	{"Customer service"}		chrislynjules@gmail.com	2025-04-10 20:21:34.216	2025-04-10 20:21:34.216
cm9bt5jd6000cvf5gdf8fs48n	5	{}		chrislynjules@gmail.com	2025-04-10 20:25:46.295	2025-04-10 20:25:46.295
cm9ek4ipu0000ju04mb7cavsz	5	{}		i0l3d@ptct.net	2025-04-12 18:36:20.803	2025-04-12 18:36:20.803
cm9gehurm0000lh04rjb7os1z	5	{}		syafiqzulfadhli099@gmail.com	2025-04-14 01:34:17.379	2025-04-14 01:34:17.379
cm9haq2r50000l704hi8iw80m	5	{}		cw22z@ptct.net	2025-04-14 16:36:28.697	2025-04-14 16:36:28.697
cm9jsn4oe000fwqekxpadj9f7	3	{"Slow loading"}		syafiqzulfadhli@graduate.utm.my	2025-04-16 10:33:36.867	2025-04-16 10:33:36.867
cm9jv74xp0000l50a2rc91qsf	5	{"Slow loading"}	slow load	syafiqzulfadhli099@gmail.com	2025-04-16 11:45:09.349	2025-04-16 11:45:09.349
cm9jwd5810000jv04cv9fkuxk	5	{"Slow loading"}	Overall very good just slow loading issues.	lokyuxuan@gmail.com	2025-04-16 12:17:49.266	2025-04-16 12:17:49.266
\.


--
-- Data for Name: PasswordResetToken; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PasswordResetToken" (token, email, expires, id) FROM stdin;
31ef2d5b-5064-4e80-8883-8d77a8b9de46	joxeve9834@clubemp.com	2025-04-14 16:48:33.554	cm9h90ges0003vf8sar1j9ljo
714477f4-d3b1-4da8-98d4-a67bc093349c	chrislynjules27@gmail.com	2025-04-14 17:40:32.358	cm9havc870002lb04jvg5paso
f3b507d1-e8ad-4228-9154-e0b8ab1877c5	chrislyn@graduate.utm.my	2025-04-14 17:54:47.373	cm9hbdo0l0000ky04ef02rsn1
a9c25100-500f-49c8-a6e3-2835d696e9bc	syafiqzulfadhli@graduate.utm.my	2025-04-16 11:24:47.512	cm9jsbsbi0004wqekq91ktai1
1dee6d98-7ddf-426f-b861-1d967de91621	syafiqzulfadhli099@gmail.com	2025-04-16 13:36:45.632	cm9jx1jkx0000kv04t8mh0vug
\.


--
-- Data for Name: PostLike; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PostLike" (id, "postId", "userId", "createdAt") FROM stdin;
cm9jwdjs80002jv048lwcwz63	cm9jtx2rp000gvfa0iwl02vss	cm85q5but0001dzu82uuvvdas	2025-04-16 12:18:08.36
cm9jwdr990004jv04mwhici15	cm9jpwci80001wq3o8mvuqixu	cm85q5but0001dzu82uuvvdas	2025-04-16 12:18:18.046
cm9jxqeek000bie04huuutruk	cm9jxom270001lg0akeulu2s3	cm7z5y2ro0000vfp898cdqhoa	2025-04-16 12:56:07.532
cm9jxqoq20009lg0awnnodtxq	cm9jxnapo0001ie04d6gtijwf	cm85q5but0001dzu82uuvvdas	2025-04-16 12:56:20.906
cm9jxqplj0001l5043xzhkr7g	cm9jxnapo0001ie04d6gtijwf	cm7z5y2ro0000vfp898cdqhoa	2025-04-16 12:56:22.04
cm9jxtcv4000hie04tslivnt7	cm9jxom270001lg0akeulu2s3	cm85q5but0001dzu82uuvvdas	2025-04-16 12:58:25.504
\.


--
-- Data for Name: PostTaggedProduct; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PostTaggedProduct" (id, "postId", "productId") FROM stdin;
cm9jpwci90003wq3ozlbrrpo7	cm9jpwci80001wq3o8mvuqixu	cm855blit0002vf64rem38dtk
cm9jtx2rr000ivfa03l0aov16	cm9jtx2rp000gvfa0iwl02vss	cm93c1z890000vfd8xbcptaex
cm9jtx2rs000jvfa0xt4ecva2	cm9jtx2rp000gvfa0iwl02vss	cm9d7wm990000vfp0ap833ll0
cm9jwmwfs0003l8047npakhyk	cm9jwmwfs0001l804ne1nh7kt	cm94eggpm0009vfd8jionbcgf
cm9jxnapo0003ie0432jy2isz	cm9jxnapo0001ie04d6gtijwf	cm9d7wm990000vfp0ap833ll0
cm9jxom270003lg0a9gbhvf58	cm9jxom270001lg0akeulu2s3	cm855blit0002vf64rem38dtk
\.


--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Product" (id, name, description, price, category, image, "createdAt", "updatedAt", likes, rank, rating, "reviewCount", subcategory, tags, trending, votes) FROM stdin;
cm915dejl0001vfbkkcgl8gsb	Green Tea Hyaluronic Lotion 150ml	\N	80	skincare	https://utfs.io/f/1FoZQ83TdBfOttnVi4OR80OozfTQ37E92gbINvxJ5awiHuse	2025-04-03 09:22:20.536	2025-04-16 11:57:30.998	0	1	0	0	serums	\N	f	0
cm918rhru0001vfy0q9wgik7o	Green Tea Hyaluronic Glow Eye & Face Ball 10ml	\N	89	Skincare	https://utfs.io/f/1FoZQ83TdBfOUhfxzcVgvweJkclbSHByYExQu5WnKZp8iNzX	2025-04-03 10:57:16.984	2025-04-28 18:19:33.231	2	1	5	2	cleansers	\N	f	5
cm9a9u0pa0000vfv0rdcn9mgo	No-Sebum Powder Cushion SPF 29 PA++ No-Sebum Powder Cushion SPF 29 PA++	\N	115	makeup	https://utfs.io/f/1FoZQ83TdBfO3Jka9gfChw8gY9sUKMfHl7nuRb2jrcQLFtzx	2025-04-09 18:37:09.427	2025-04-14 12:57:35.587	0	1	0	0	face	{neutral_f3d7c2}	f	0
cm93c1z890000vfd8xbcptaex	Intensive Leisure Sun Stick SPF50+ PA++++ 18g	\N	80	skincare	https://utfs.io/f/1FoZQ83TdBfOXNyU7MxODSq2NmWfki5jxyG6HFCVoa71vsXY	2025-04-04 22:04:57.367	2025-04-04 22:04:57.367	0	\N	0	0	sunscreen	\N	f	0
cm94eggpm0009vfd8jionbcgf	Home  Black Tea Youth Enhancing Skin Black Tea Youth Enhancing Skin	\N	115	skincare	https://utfs.io/f/1FoZQ83TdBfOx7p7WMnHj4FRsiCh5SYy0vD3NrwfeaLl9O61	2025-04-05 15:59:58.616	2025-04-14 12:43:14.177	0	1	0	0	toners	{dullness}	f	1
cm9d7wm990000vfp0ap833ll0	Isle Number Body Lotion #Green Tea Essence 300ml Isle Number Body Lotion #Green Tea Essence 300ml	\N	90	hairbody	https://utfs.io/f/1FoZQ83TdBfOlELaP85BFmA9oCDxOe5XYT7Hca2n6UWSyZfk	2025-04-11 20:06:30.392	2025-04-11 20:06:30.392	0	\N	0	0	lotions	{}	f	0
cm915fs3x0002vfbkg3he9qmm	Green Tea Hyaluronic Skin 150ml	\N	80	Skincare	https://utfs.io/f/1FoZQ83TdBfOU9S9kVgvweJkclbSHByYExQu5WnKZp8iNzXI	2025-04-03 09:24:11.402	2025-04-16 10:55:39.975	1	9	0	0	cleansers	\N	f	1
cm915ob2v0004vfbkfojyths9	Green Tea Hyaluronic Mist 150ml	\N	56	Skincare	https://utfs.io/f/1FoZQ83TdBfOr4z6vd1hGWkewUb9AdSyj0sRp4D7oMtXCq6l	2025-04-03 09:30:49.25	2025-04-16 10:55:46.078	0	5	0	0	cleansers	\N	f	1
cm9196qlb0002vfy0iczii7on	Green Tea Hyaluronic Moist Sun Serum SPF50+ PA++++ 25ml	\N	60	Skincare	https://utfs.io/f/1FoZQ83TdBfOYgqKVwLaSJ1I2W6inV4Kv8jCr7RkPgQTwHUG	2025-04-03 11:09:08.252	2025-04-14 15:06:37.752	0	8	0	0	cleansers	\N	f	1
cm855k25c0003vf64378bboh5	INNISFREE Green Tea Seed Hyaluronic Serum	\N	132	Skincare	https://utfs.io/f/1FoZQ83TdBfOGW8mGCEV7Yp1JmNnHoLDAMhWsOcKduvUP9al	2025-03-11 23:58:53.641	2025-04-14 16:26:53.083	1	4	0	0	cleansers	\N	f	2
cm855blit0002vf64rem38dtk	INNISFREE Green Tea Seed Hyaluronic Cream 	\N	110	Skincare	https://utfs.io/f/1FoZQ83TdBfO50vkGHXeAtMUK30WdrPmnqJD81NYBELSci9f	2025-03-11 23:52:18.843	2025-04-14 12:49:12.794	0	10	0	0	cleansers	\N	f	1
cm915m6kn0003vfbk5e5si8yq	Green Tea Amino Hydrating Cleansing Water 320ml	\N	68	skincare	https://utfs.io/f/1FoZQ83TdBfOpYU2IQM5JOkjCQelXKYs8T2om7faPw1EMxhb	2025-04-03 09:29:10.275	2025-04-16 11:56:32.799	1	3	0	0	cleansers	{dry,acne}	f	2
cm918k4uq0000vfy0no14m4ta	Green Tea Hyaluronic Moist Sun Serum SPF50+ PA++++ 50ml	\N	99	Skincare	https://utfs.io/f/1FoZQ83TdBfOSZMAsQq4bsBKa7J8vFU1o6inmWOxYuEMz2hk	2025-04-03 10:51:33.315	2025-04-14 15:06:28.562	0	6	0	0	cleansers	\N	f	1
cm9151k2z0000vfbkhwdlizpb	Green Tea Amino Hydrating Cleansing Foam 150g	\N	50	skincare	https://utfs.io/f/1FoZQ83TdBfO5OfRvVXeAtMUK30WdrPmnqJD81NYBELSci9f	2025-04-03 09:13:08.073	2025-04-14 13:44:00.163	2	7	0	0	cleansers	{universal,sensitive}	f	1
cm9197ypp0003vfy08rvovsuu	Green Tea Hydrating Cleansing Oil 150ml	\N	88	Skincare	https://utfs.io/f/1FoZQ83TdBfOu7OZi5lAcg5mfGEqBX80VFLd9oDJnTWj3wtU	2025-04-03 11:10:05.415	2025-04-16 12:55:25.127	2	2	3	2	cleansers	\N	f	2
\.


--
-- Data for Name: ProductLike; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProductLike" (id, "productId", "createdAt", "userEmail") FROM stdin;
cm9jvg2sz0003js0aa90sjjg3	cm918rhru0001vfy0q9wgik7o	2025-04-16 11:52:06.707	lokyuxuan@gmail.com
cm9jxpgul0007ie0498cfwapb	cm9197ypp0003vfy08rvovsuu	2025-04-16 12:55:24.045	lokyuxuan@gmail.com
cma1dvvzp0001l2047xfoq058	cm918rhru0001vfy0q9wgik7o	2025-04-28 18:00:22.453	chrislynjules@gmail.com
cm9dbuq190003vftglzxgn6m7	cm9197ypp0003vfy08rvovsuu	2025-04-11 21:57:00.617	chrislynjules@gmail.com
cm9gdxzoc0001l504n46jzf3f	cm915fs3x0002vfbkg3he9qmm	2025-04-14 01:18:50.845	syafiqzulfadhli099@gmail.com
cm9h3us4z0009vfj0gxpq70zx	cm915m6kn0003vfbk5e5si8yq	2025-04-14 13:24:11.123	chrislynjules@gmail.com
cm9h4k9im000nvfj0u61a1vg1	cm9151k2z0000vfbkhwdlizpb	2025-04-14 13:44:00.046	chrislynjules@gmail.com
cm9h62gix000pvfj0kyrzs6my	cm855k25c0003vf64378bboh5	2025-04-14 14:26:08.551	chrislynjules@gmail.com
\.


--
-- Data for Name: ProductVote; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProductVote" (id, "productId", week, year, "createdAt", "userEmail") FROM stdin;
cm9dbad4r0004vfp0z5uopzvu	cm9196qlb0002vfy0iczii7on	16	2025	2025-04-11 21:41:10.771	chrislynjules@gmail.com
cm9dbvod90007vftg4vreuba0	cm918rhru0001vfy0q9wgik7o	16	2025	2025-04-11 21:57:45.116	chrislynjules@gmail.com
cm9ejggh30001ju048623dshq	cm9197ypp0003vfy08rvovsuu	16	2025	2025-04-12 18:17:38.151	i0l3d@ptct.net
cm9ejhg5v0001jp04rptmtemm	cm918rhru0001vfy0q9wgik7o	16	2025	2025-04-12 18:18:24.402	i0l3d@ptct.net
cm9gzf2zz0001vfqsj03ye6ws	cm9197ypp0003vfy08rvovsuu	16	2025	2025-04-14 11:20:00.235	chrislynjules@gmail.com
cm9gzgh0d0001jr04zlw5kcbh	cm855blit0002vf64rem38dtk	16	2025	2025-04-14 11:21:05.052	chrislynjules@gmail.com
cm9h010sg0005vffk4zrdjmlb	cm9151k2z0000vfbkhwdlizpb	16	2025	2025-04-14 11:37:03.805	chrislynjules@gmail.com
cm9h06ube0001vf64c33ler9a	cm855k25c0003vf64378bboh5	16	2025	2025-04-14 11:41:35.347	chrislynjules@gmail.com
cm9h0eoaw0001vfz8tuat7u7q	cm915m6kn0003vfbk5e5si8yq	16	2025	2025-04-14 11:47:40.799	chrislynjules@gmail.com
cm9h0jsl40001vfgwk3gaq11y	cm915ob2v0004vfbkfojyths9	16	2025	2025-04-14 11:51:39.634	chrislynjules@gmail.com
cm9h2e4720001vfo8da26oiud	cm94eggpm0009vfd8jionbcgf	16	2025	2025-04-14 12:43:13.975	chrislynjules@gmail.com
cm9h2htjq0001vfbol0pyares	cm918k4uq0000vfy0no14m4ta	16	2025	2025-04-14 12:46:06.802	chrislynjules@gmail.com
cm9h2lqi30001lh047uztwawp	cm915fs3x0002vfbkg3he9qmm	16	2025	2025-04-14 12:49:09.482	chrislynjules@gmail.com
cm9hadpm60005lb04kfuaqgjn	cm855k25c0003vf64378bboh5	16	2025	2025-04-14 16:26:52.013	cw22z@ptct.net
cm9jsiyr60008wqekqhy6xbv3	cm918rhru0001vfy0q9wgik7o	16	2025	2025-04-16 10:30:22.574	syafiqzulfadhli@graduate.utm.my
cm9jtfvlh000cvfa0vm39xhrg	cm918rhru0001vfy0q9wgik7o	16	2025	2025-04-16 10:55:58.127	1tian@ptct.net
cm9jvfmv50001js0ancaoenez	cm918rhru0001vfy0q9wgik7o	16	2025	2025-04-16 11:51:46.049	lokyuxuan@gmail.com
cm9jvlr9h0005l104nct4a2lv	cm915m6kn0003vfbk5e5si8yq	16	2025	2025-04-16 11:56:31.684	syafiqzulfadhli099@gmail.com
\.


--
-- Data for Name: Review; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Review" (id, content, rating, images, "authorId", "productId", "createdAt", "updatedAt", metadata) FROM stdin;
cm9dbg3qh0001vftg02rrp8g6	\N	5	{}	cm7z5y2ro0000vfp898cdqhoa	cm918rhru0001vfy0q9wgik7o	2025-04-11 21:45:38.524	2025-04-11 21:45:38.524	{"skinType": []}
cm9dd6k9g000bvftgbb3rehe5	ilovethisprouct so much	5	{https://utfs.io/f/1FoZQ83TdBfOvkq04jmBsJQRGehoxqNAmrU8C1tOPDkudf9K}	cm7z5y2ro0000vfp898cdqhoa	cm9197ypp0003vfy08rvovsuu	2025-04-11 22:34:12.625	2025-04-11 22:34:12.625	{"skinType": ["Acne-Prone"]}
cm9gdve7f0001jr04ijzk4b4f	\N	5	{}	cm8pjvvn90001wqx4fdxyhr1k	cm918rhru0001vfy0q9wgik7o	2025-04-14 01:16:49.708	2025-04-14 01:16:49.708	{"skinType": ["Sensitive Skin"]}
cm9h63dlu000tvfj0u13guzz5	\N	1	{}	cm7z5y2ro0000vfp898cdqhoa	cm9197ypp0003vfy08rvovsuu	2025-04-14 14:26:51.424	2025-04-14 14:26:51.424	{"skinType": []}
\.


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Session" ("sessionToken", "userId", expires, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Staff; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Staff" (id, "userId", email, username, bio, "imageUrl", department, name) FROM stdin;
cm7z64a5q000bvfp8qyyhgi70	cm7z64a2c0009vfp8n8mkyacq	chrislynjules27@gmail.com	staff test	Hello Babyy girl\n	https://utfs.io/f/1FoZQ83TdBfOVV2JO0YkoRTmIaOUZu3x1qplKz6H7Ct5n0Bj	Marketing	Chrislyn Jules
cm9jy2rcq0002l80a3otlgwex	cm9jy2qgz0000l80ahb2m2gde	lokkycool@gmail.com	\N	\N	\N	Social	Xuan
cm9jy3ltt0005l80amighbp6s	cm9jy3ky20003l80aflv7wroi	lokyuxuan12@gmail.com	\N	\N	\N	Testing	Fiah
cm9jy4g4v0008l80awned2h70	cm9jy4f950006l80adlp0bnno	adam12345000@gmail.com	\N	\N	\N	Financial	Adam
cm9jy5ayy000bl80awh7z8q4f	cm9jy5a380009l80ar4cp0dda	syafiqtest1234@gmail.com	\N	\N	\N	Software	Fiq
\.


--
-- Data for Name: Task; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Task" (id, title, content, "assignedTo", "dueDate", priority, status, "createdAt", "updatedAt") FROM stdin;
cm9ageyw40005vfncpe55psdp	main task	yes	cm7z64a5q000bvfp8qyyhgi70	2025-04-10 16:00:00	medium	completed	2025-04-09 21:41:25.123	2025-04-17 12:26:29.529
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, email, "createdAt", "emailVerified", image, "updatedAt", password, role) FROM stdin;
cm94d31nv0000vf6o6lnakr67	vau9m@ptct.net	2025-04-05 15:21:32.97	\N	\N	2025-04-05 15:54:07.809	$2a$10$cYbqa8SFOH0IUdH/QBt5putlBJP3VYtYkEKlxKmnbhoWmyq1Ieg6.	CLIENT
cm85q5but0001dzu82uuvvdas	lokyuxuan@gmail.com	2025-03-12 09:35:18.33	2025-03-12 17:39:10.015	\N	2025-04-16 11:53:13.957	$2a$10$DyvTdTBD/Pyhfa4SHvU/seSm6NC3k/rOegKGcFjp11gg5/dmqvJCS	CLIENT
cm7z5y2ro0000vfp898cdqhoa	chrislynjules@gmail.com	2025-03-07 19:23:10.596	2025-04-12 14:40:45.88	\N	2025-04-12 14:40:45.882	$2a$10$a6L9Zzj8Slgu.VB6zHp1XerLhBxVgEuw33sgzE7HKjXfWAiFkoigK	CLIENT
cm8pjvvn90001wqx4fdxyhr1k	syafiqzulfadhli099@gmail.com	2025-03-26 06:35:23.246	2025-04-11 19:55:52.011	\N	2025-04-16 12:01:43.373	$2a$10$hx.aT3UG75FEn5YiDIgmKeMOJYT9dpaVzam/qepnge2S6WZIf6pC6	CLIENT
cm9jweuqg0000l50475qp0gjw	yenaf76817@ovobri.com	2025-04-16 12:19:09.209	\N	\N	2025-04-16 12:19:09.209	$2a$10$KctwCcoIvME3sk.4eO.Y..bezX7bEddRdO6kJ8q.WO0jfGssaUmNW	CLIENT
cm9jwoml90000l204fa4spb9h	88me5@ptct.net	2025-04-16 12:26:45.214	\N	\N	2025-04-16 12:26:45.214	$2a$10$CpopmOn3LtSMKzKgOpMYPuiyncnLyCv1g5pLxG9nyjW93XywW/PCe	CLIENT
cm9jwt41t0003l5045cohso2u	syafiqzulfadhli@graduate.utm.my	2025-04-16 12:30:14.466	2025-04-16 12:30:48.147	\N	2025-04-16 12:30:48.149	$2a$10$f44cjRDGfCEk4ahJYgf8KO5LylvjXZU0OmBZqfnXo.fn.wAaZoh3u	CLIENT
cm9jwxs4a0000jy0434wkk67u	cm02k@ptct.net	2025-04-16 12:33:52.282	\N	\N	2025-04-16 12:33:52.282	$2a$10$i.mshGb9WqjEY36821m5vePSffQdR1J2Ja4q.NJ0R/u.kAJh43FKC	CLIENT
cm9jy2qgz0000l80ahb2m2gde	lokkycool@gmail.com	2025-04-16 13:05:43.043	2025-04-16 13:05:43.042	\N	2025-04-16 13:05:43.043	$2a$10$xsU9j9BLf6//oQ34PaXGq.7YvuiXtG7ULamOaJarUHkq6fNE6Fz.C	STAFF
cm9ej72gs0000kz04lok26onq	i0l3d@ptct.net	2025-04-12 18:10:20.093	2025-04-12 19:03:17.096	\N	2025-04-12 19:03:17.097	$2a$10$YFxZi3kk3AZnt4v8NTmoQuVYgbMXppEYypKNeNHYiAw3nFTq8zmEi	CLIENT
cm9jy3ky20003l80aflv7wroi	lokyuxuan12@gmail.com	2025-04-16 13:06:22.539	2025-04-16 13:06:22.537	\N	2025-04-16 13:06:22.539	$2a$10$LKTK.Fi0hfkwaVdOacCkXOdAa0hxMrhTJ0Y1M.x/3lwqNNp2ZaOva	STAFF
cm9jy4f950006l80adlp0bnno	adam12345000@gmail.com	2025-04-16 13:07:01.817	2025-04-16 13:07:01.804	\N	2025-04-16 13:07:01.817	$2a$10$0ELJFeQ41Bv9Xpd6ckrDOOQh5OWeKHOd8qkAxlWjrLwRXkczOuSFK	STAFF
cm9h9k5v90004vf8s4c73ya1s	copimi@azuretechtalk.net	2025-04-14 16:03:53.395	2025-04-14 16:04:10.165	\N	2025-04-14 16:04:10.167	$2a$10$SaOoOHcRfgqkKnGYKWaFXerh.fNucAEtWjtOT0y2GSi2cU0nSdRr.	CLIENT
cm9jy5a380009l80ar4cp0dda	syafiqtest1234@gmail.com	2025-04-16 13:07:41.781	2025-04-16 13:07:41.779	\N	2025-04-16 13:07:41.781	$2a$10$W2h11w/8KNmEw7usPAsIYOmy1lQZ8miaIgPnt8Dm2TSOOHX6PX5UO	STAFF
cm7z64a2c0009vfp8n8mkyacq	chrislynjules27@gmail.com	2025-03-07 19:27:59.987	2025-03-07 19:27:59.985	\N	2025-04-14 16:43:40.218	$2a$10$KCD/5jj6pNx1V/8Df1uJ/OXFXxZZYpFBK.5AYk8Czd039dv1DvGrG	STAFF
cm7z6250b0006vfp89trd61kr	chrislyn@graduate.utm.my	2025-03-07 19:26:20.124	2025-03-07 19:26:37.915	\N	2025-04-14 16:56:21.366	$2a$10$9Ynh/rwZLfbbAX6pn77TMuoBzdkeZ/7VD/hVizog40a32uenNy2S2	ADMIN
cm9jt243r0000vfa0yrskatz3	1tian@ptct.net	2025-04-16 10:45:15.971	2025-04-16 10:45:35.929	\N	2025-04-16 10:45:35.932	$2a$10$bvXxUpVKU1OBxkHwJoNEgOuA8lIT2UPAt9MQ8KJCZvhW7Ig/7R1P.	CLIENT
\.


--
-- Data for Name: UserRecommendation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UserRecommendation" (id, "userEmail", "productId", "createdAt") FROM stdin;
cm9h7ivvr000pvfyksg16flw6	chrislynjules@gmail.com	cm918rhru0001vfy0q9wgik7o	2025-04-14 15:06:54.566
cm9h7zqah0001vfa4uag6oypz	chrislynjules@gmail.com	cm9151k2z0000vfbkhwdlizpb	2025-04-14 15:20:00.468
cm9jokkts0003jn04xy6i9spe	syafiqzulfadhli099@gmail.com	cm9197ypp0003vfy08rvovsuu	2025-04-16 08:39:39.377
cm9jwhvjd0001jv04ivl0fcjm	lokyuxuan@gmail.com	cm915m6kn0003vfbk5e5si8yq	2025-04-16 12:21:30.217
cm9jwhwl50001l10a4pp1qlbl	lokyuxuan@gmail.com	cm9151k2z0000vfbkhwdlizpb	2025-04-16 12:21:31.578
cm9jy6yxx0005l50483pm6gcq	chrislynjules@gmail.com	cm9a9u0pa0000vfv0rdcn9mgo	2025-04-16 13:09:00.645
cm94dvus30002vfd8grek7dx2	vau9m@ptct.net	cm915m6kn0003vfbk5e5si8yq	2025-04-05 15:43:57.069
cm94dvus30003vfd8svf3ptl0	vau9m@ptct.net	cm9151k2z0000vfbkhwdlizpb	2025-04-05 15:43:57.073
cm94ixci20002vfr8v8t12z8f	chrislynjules@gmail.com	cm915m6kn0003vfbk5e5si8yq	2025-04-05 18:05:04.777
cm9ejyo5f000ak204wdr17nm2	i0l3d@ptct.net	cm9151k2z0000vfbkhwdlizpb	2025-04-12 18:31:47.908
cm9ejyoy90001jr0419ak1qsz	i0l3d@ptct.net	cm915m6kn0003vfbk5e5si8yq	2025-04-12 18:31:48.945
cm9geso8e0003wqfw3m7pg6mu	chrislynjules@gmail.com	cm9197ypp0003vfy08rvovsuu	2025-04-14 01:42:42.351
\.


--
-- Data for Name: VerificationToken; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."VerificationToken" (token, expires, _id, email) FROM stdin;
fda74776-87b2-4605-80d0-ab88fcccd86d	2025-03-12 18:00:06.839	3b9d68cc-6b47-48c0-9802-36d4e4f3fa3b	k8wuu@indigobook.com
955d9a48-3a8f-484b-abfe-511eb1629992	2025-03-13 02:44:32.036	0e8fc830-f5ba-44c8-97bc-aca9197a03c1	bz9oq@indigobook.com
eabc5e90-b5e5-40eb-a07f-debce8ec235c	2025-03-26 07:35:20.886	66cca51c-c520-483f-946b-7193f5183e8e	syafiqzulfadhli099@gmail.com
e0987023-6234-4e34-8483-6ad4f77e6b1d	2025-04-05 16:53:39.901	c39f122b-261a-4563-83d7-ba05dd4d855a	vau9m@ptct.net
7cb3367b-f9e4-4ce4-afa4-2bc79c000683	2025-04-05 18:32:51.515	a8604dbe-3757-47a5-894a-03eb2c191bc0	9qlbe@ptct.net
9eecec24-4bed-4978-9b7d-8cb9eb930690	2025-04-06 20:50:14.45	7e08d52e-3832-4d9f-b038-416d985c69c2	hdd8z@ptct.net
7976b499-af17-4843-b13f-d4a0394c9018	2025-04-10 10:53:22.73	7d510d1e-5087-4645-9802-d4ee57f7e8a2	excdp@ptct.net
3e1196e5-606c-45fb-a5b1-59554a5a4574	2025-04-12 15:45:37.723	73b64afe-0e5d-43c7-8e20-0193eac2bafd	jhhwh@ptct.net
51409f8c-e4d8-4cb6-bf97-e29d399b10a9	2025-04-12 15:47:15.646	c4b32da4-462a-412b-813d-ca0e1c799ffe	chrislynjules@gmail.com
12aa3408-1b22-486c-8414-8a26c24c343d	2025-04-12 18:51:58.038	e0539913-5ddb-4a75-b61f-9aab6df86e64	colintehjr@gmail.com
1af7e46c-39ba-4c4f-9041-fdbdc018fc7a	2025-04-12 19:42:21.068	bd718661-f62f-40d1-a4bf-b60c575c44a0	i0l3d@ptct.net
bec81fb6-41db-4714-8219-dd1929de4d38	2025-04-13 16:30:23.505	d3a3e1b1-2512-4617-9364-59c487eea550	emmanueljanot23@gmail.com
9cf639f1-9f30-425c-b941-37aab3347639	2025-04-14 16:30:19.881	bb0ac10f-549c-4de0-9f93-62ee0121bc6e	8dc78@ptct.net
9e583f3f-6d33-4fe1-b52d-99e16f079100	2025-04-14 16:35:16.915	7075c0e0-d124-48fb-abeb-ebd09a4de233	bb8wj@ptct.net
744535e0-5d24-4197-a24e-3c7f014ce5b0	2025-04-14 16:46:28.916	3d23a883-538f-4ee9-9c2b-e9cd06ecece0	joxeve9834@clubemp.com
f7943bce-1874-4e65-9d2d-f35c399c8a7b	2025-04-16 13:19:06.286	d16f6118-803a-4691-a50e-1146ab719525	yenaf76817@ovobri.com
1e626c92-5be6-4d97-98ae-1ff13c615375	2025-04-16 13:26:42.455	a327bba1-419d-41a0-a635-27b8b8a49f0c	88me5@ptct.net
86219bb4-fcc6-462e-9bde-6b07b5b107d3	2025-04-16 13:33:49.128	89e65719-798a-4e71-b3ba-c1b227f75321	cm02k@ptct.net
\.


--
-- Data for Name: _BeautyInfoPostLikeToUser; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_BeautyInfoPostLikeToUser" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _ProductVoteToUser; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_ProductVoteToUser" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
88bffb8f-74e6-4bb2-a01f-596e08d6d7d1	ead2af5a6420e45f7e30191efa64d6eadb44d1fc6476f5552e442831d5dada40	2025-03-07 19:21:05.582137+00	20250126181426_init	\N	\N	2025-03-07 19:21:05.464149+00	1
8bfb9985-66db-48a3-9bfa-258fa18f1364	fd3687741e3008f9cf823c2628e0f091d595f2c67d6fdcd42411d5a3c1ae218b	2025-03-07 19:21:05.780109+00	20250126193334_init	\N	\N	2025-03-07 19:21:05.626628+00	1
eef8790b-cbcb-4881-a8e0-7a7496214c9a	ab80a534dfa4779eeae4ae5aeac192eea19b283671d6083c8f112e3c8a4229df	2025-03-07 19:21:05.926714+00	20250126200503_init	\N	\N	2025-03-07 19:21:05.821715+00	1
75d05864-2f8d-4776-9729-6399723e4de4	abbc8e3e4ff87143b119dcc1061b3e2e4ea88e4f95068525f2808a6f49482eae	2025-03-07 19:21:06.079181+00	20250126203810_rename_name_to_username	\N	\N	2025-03-07 19:21:05.969729+00	1
ba16dcdd-0ddc-467c-8a25-5ce95371275f	3bdfc5e21f6cf1ce128f4edd1649b46f69639d8e6a66f959fe35b4494ba23c32	2025-03-07 19:21:06.4942+00	20250126211300_rename_user_type_to_role	\N	\N	2025-03-07 19:21:06.123966+00	1
75aee745-6383-4481-8c4c-051cc00523c4	2b2bf863cfc8d0603ca9ea3097e1a8493d7bae31cf0fdbf2218fda2de57bc526	2025-03-07 19:21:06.740181+00	20250130195557_add_password_reset_token	\N	\N	2025-03-07 19:21:06.536053+00	1
5b12c5c2-837a-4928-9fc1-71d5bcb7db05	221d2950ee593970e5d844d8e37d7cfdf59c1bbb3961013cd071ed01edd2d9c4	2025-03-07 19:21:07.044706+00	20250201055729_delete_verification_token_table	\N	\N	2025-03-07 19:21:06.821583+00	1
8ce1437f-e920-40f1-a5b2-a73e69089d9a	a96b24ea69d8f7532049448c69d3fbf27d8ed59dc60ea62eda3a3710608ac86f	2025-03-07 19:21:07.415163+00	20250201060058_verification_token	\N	\N	2025-03-07 19:21:07.131322+00	1
159abc49-57cf-4896-bfbf-dc59e9c7589f	14f40d82d9579d51682aeff8a56d84aa3b31370c2cae84607f8653517fa25aca	2025-03-07 19:21:07.661015+00	20250203153125_add_password_reset_token	\N	\N	2025-03-07 19:21:07.458453+00	1
bfb65bf1-0987-4cb8-8e9a-6a91080da277	94cf11d1d40a8f53f1fa82b3fc564edafdf05e7699dca426194990c23daab82c	2025-03-07 19:21:07.967951+00	20250304110955_update_schema	\N	\N	2025-03-07 19:21:07.746925+00	1
4f62fbac-d05f-48f5-ba15-e23a49b291dd	a77d22261fb9187e2a1c99688275759ec352e0c38cbbe3a75dc7021da9a77554	2025-03-07 19:21:12.681719+00	20250307192112_add_email_to_feedback	\N	\N	2025-03-07 19:21:12.537127+00	1
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2025-01-22 04:16:41
20211116045059	2025-01-22 04:16:41
20211116050929	2025-01-22 04:16:41
20211116051442	2025-01-22 04:16:41
20211116212300	2025-01-22 04:16:41
20211116213355	2025-01-22 04:16:41
20211116213934	2025-01-22 04:16:41
20211116214523	2025-01-22 04:16:41
20211122062447	2025-01-22 04:16:41
20211124070109	2025-01-22 04:16:41
20211202204204	2025-01-22 04:16:41
20211202204605	2025-01-22 04:16:41
20211210212804	2025-01-22 04:16:41
20211228014915	2025-01-22 04:16:41
20220107221237	2025-01-22 04:16:41
20220228202821	2025-01-22 04:16:41
20220312004840	2025-01-22 04:16:41
20220603231003	2025-01-22 04:16:41
20220603232444	2025-01-22 04:16:41
20220615214548	2025-01-22 04:16:41
20220712093339	2025-01-22 04:16:41
20220908172859	2025-01-22 04:16:41
20220916233421	2025-01-22 04:16:41
20230119133233	2025-01-22 04:16:41
20230128025114	2025-01-22 04:16:41
20230128025212	2025-01-22 04:16:41
20230227211149	2025-01-22 04:16:41
20230228184745	2025-01-22 04:16:41
20230308225145	2025-01-22 04:16:41
20230328144023	2025-01-22 04:16:41
20231018144023	2025-01-22 04:16:41
20231204144023	2025-01-22 04:16:41
20231204144024	2025-01-22 04:16:41
20231204144025	2025-01-22 04:16:41
20240108234812	2025-01-22 04:16:41
20240109165339	2025-01-22 04:16:41
20240227174441	2025-01-22 04:16:41
20240311171622	2025-01-22 04:16:41
20240321100241	2025-01-22 04:16:41
20240401105812	2025-01-22 04:16:41
20240418121054	2025-01-22 04:16:41
20240523004032	2025-01-22 04:16:42
20240618124746	2025-01-22 04:16:42
20240801235015	2025-01-22 04:16:42
20240805133720	2025-01-22 04:16:42
20240827160934	2025-01-22 04:16:42
20240919163303	2025-01-22 04:16:42
20240919163305	2025-01-22 04:16:42
20241019105805	2025-01-22 04:16:42
20241030150047	2025-01-22 04:16:42
20241108114728	2025-01-22 04:16:42
20241121104152	2025-01-22 04:16:42
20241130184212	2025-01-22 04:16:42
20241220035512	2025-01-22 04:16:42
20241220123912	2025-01-22 04:16:42
20241224161212	2025-01-22 04:16:42
20250107150512	2025-01-22 04:16:42
20250110162412	2025-01-22 04:16:42
20250123174212	2025-01-24 13:07:42
20250128220012	2025-01-30 16:06:32
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at) FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2025-01-22 04:12:17.47407
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2025-01-22 04:12:17.499417
2	storage-schema	5c7968fd083fcea04050c1b7f6253c9771b99011	2025-01-22 04:12:17.513901
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2025-01-22 04:12:17.554389
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2025-01-22 04:12:17.594925
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2025-01-22 04:12:17.610623
6	change-column-name-in-get-size	f93f62afdf6613ee5e7e815b30d02dc990201044	2025-01-22 04:12:17.626523
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2025-01-22 04:12:17.646464
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2025-01-22 04:12:17.661281
9	fix-search-function	3a0af29f42e35a4d101c259ed955b67e1bee6825	2025-01-22 04:12:17.679688
10	search-files-search-function	68dc14822daad0ffac3746a502234f486182ef6e	2025-01-22 04:12:17.706514
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2025-01-22 04:12:17.73485
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2025-01-22 04:12:17.752258
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2025-01-22 04:12:17.76677
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2025-01-22 04:12:17.783139
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2025-01-22 04:12:17.839087
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2025-01-22 04:12:17.856414
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2025-01-22 04:12:17.874622
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2025-01-22 04:12:17.890883
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2025-01-22 04:12:17.910573
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2025-01-22 04:12:17.928441
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2025-01-22 04:12:17.951943
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2025-01-22 04:12:17.9985
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2025-01-22 04:12:18.044611
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2025-01-22 04:12:18.060073
25	custom-metadata	67eb93b7e8d401cafcdc97f9ac779e71a79bfe03	2025-01-22 04:12:18.074648
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 23, true);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('pgsodium.key_key_id_seq', 1, false);


--
-- Name: BeautyInfoPostLike_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."BeautyInfoPostLike_id_seq"', 126, true);


--
-- Name: BeautyInfoPost_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."BeautyInfoPost_id_seq"', 27, true);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: supabase_admin
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: Account Account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY (provider, "providerAccountId");


--
-- Name: Admin Admin_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Admin"
    ADD CONSTRAINT "Admin_pkey" PRIMARY KEY (id);


--
-- Name: Authenticator Authenticator_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Authenticator"
    ADD CONSTRAINT "Authenticator_pkey" PRIMARY KEY ("userId", "credentialID");


--
-- Name: BeautyInfoPostLike BeautyInfoPostLike_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BeautyInfoPostLike"
    ADD CONSTRAINT "BeautyInfoPostLike_pkey" PRIMARY KEY (id);


--
-- Name: BeautyInfoPost BeautyInfoPost_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BeautyInfoPost"
    ADD CONSTRAINT "BeautyInfoPost_pkey" PRIMARY KEY (id);


--
-- Name: ClientPost ClientPost_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ClientPost"
    ADD CONSTRAINT "ClientPost_pkey" PRIMARY KEY (id);


--
-- Name: Client Client_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Client"
    ADD CONSTRAINT "Client_pkey" PRIMARY KEY (id);


--
-- Name: Comment Comment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_pkey" PRIMARY KEY (id);


--
-- Name: Feedback Feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Feedback"
    ADD CONSTRAINT "Feedback_pkey" PRIMARY KEY (id);


--
-- Name: PasswordResetToken PasswordResetToken_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PasswordResetToken"
    ADD CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY (id);


--
-- Name: PostLike PostLike_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PostLike"
    ADD CONSTRAINT "PostLike_pkey" PRIMARY KEY (id);


--
-- Name: PostTaggedProduct PostTaggedProduct_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PostTaggedProduct"
    ADD CONSTRAINT "PostTaggedProduct_pkey" PRIMARY KEY (id);


--
-- Name: ProductLike ProductLike_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductLike"
    ADD CONSTRAINT "ProductLike_pkey" PRIMARY KEY (id);


--
-- Name: ProductVote ProductVote_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductVote"
    ADD CONSTRAINT "ProductVote_pkey" PRIMARY KEY (id);


--
-- Name: Product Product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY (id);


--
-- Name: Review Review_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_pkey" PRIMARY KEY (id);


--
-- Name: Staff Staff_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Staff"
    ADD CONSTRAINT "Staff_pkey" PRIMARY KEY (id);


--
-- Name: Task Task_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Task"
    ADD CONSTRAINT "Task_pkey" PRIMARY KEY (id);


--
-- Name: UserRecommendation UserRecommendation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserRecommendation"
    ADD CONSTRAINT "UserRecommendation_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: VerificationToken VerificationToken_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VerificationToken"
    ADD CONSTRAINT "VerificationToken_pkey" PRIMARY KEY (_id);


--
-- Name: _BeautyInfoPostLikeToUser _BeautyInfoPostLikeToUser_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_BeautyInfoPostLikeToUser"
    ADD CONSTRAINT "_BeautyInfoPostLikeToUser_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _ProductVoteToUser _ProductVoteToUser_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_ProductVoteToUser"
    ADD CONSTRAINT "_ProductVoteToUser_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: Admin_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Admin_email_key" ON public."Admin" USING btree (email);


--
-- Name: Admin_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Admin_userId_key" ON public."Admin" USING btree ("userId");


--
-- Name: Authenticator_credentialID_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Authenticator_credentialID_key" ON public."Authenticator" USING btree ("credentialID");


--
-- Name: BeautyInfoPostLike_postId_userEmail_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "BeautyInfoPostLike_postId_userEmail_key" ON public."BeautyInfoPostLike" USING btree ("postId", "userEmail");


--
-- Name: Client_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Client_email_key" ON public."Client" USING btree (email);


--
-- Name: Client_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Client_userId_key" ON public."Client" USING btree ("userId");


--
-- Name: PasswordResetToken_email_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PasswordResetToken_email_token_key" ON public."PasswordResetToken" USING btree (email, token);


--
-- Name: PasswordResetToken_expires_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PasswordResetToken_expires_idx" ON public."PasswordResetToken" USING btree (expires);


--
-- Name: PasswordResetToken_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON public."PasswordResetToken" USING btree (token);


--
-- Name: PostLike_postId_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PostLike_postId_userId_key" ON public."PostLike" USING btree ("postId", "userId");


--
-- Name: PostTaggedProduct_postId_productId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PostTaggedProduct_postId_productId_key" ON public."PostTaggedProduct" USING btree ("postId", "productId");


--
-- Name: ProductLike_userEmail_productId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ProductLike_userEmail_productId_key" ON public."ProductLike" USING btree ("userEmail", "productId");


--
-- Name: ProductVote_userEmail_productId_week_year_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ProductVote_userEmail_productId_week_year_key" ON public."ProductVote" USING btree ("userEmail", "productId", week, year);


--
-- Name: Product_category_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Product_category_idx" ON public."Product" USING btree (category);


--
-- Name: Product_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Product_name_idx" ON public."Product" USING btree (name);


--
-- Name: Product_price_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Product_price_idx" ON public."Product" USING btree (price);


--
-- Name: Review_authorId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Review_authorId_idx" ON public."Review" USING btree ("authorId");


--
-- Name: Review_productId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Review_productId_idx" ON public."Review" USING btree ("productId");


--
-- Name: Session_sessionToken_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Session_sessionToken_key" ON public."Session" USING btree ("sessionToken");


--
-- Name: Staff_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Staff_email_key" ON public."Staff" USING btree (email);


--
-- Name: Staff_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Staff_userId_key" ON public."Staff" USING btree ("userId");


--
-- Name: UserRecommendation_userEmail_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "UserRecommendation_userEmail_idx" ON public."UserRecommendation" USING btree ("userEmail");


--
-- Name: UserRecommendation_userEmail_productId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "UserRecommendation_userEmail_productId_key" ON public."UserRecommendation" USING btree ("userEmail", "productId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: VerificationToken_email_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "VerificationToken_email_token_key" ON public."VerificationToken" USING btree (email, token);


--
-- Name: VerificationToken_expires_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "VerificationToken_expires_idx" ON public."VerificationToken" USING btree (expires);


--
-- Name: _BeautyInfoPostLikeToUser_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_BeautyInfoPostLikeToUser_B_index" ON public."_BeautyInfoPostLikeToUser" USING btree ("B");


--
-- Name: _ProductVoteToUser_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_ProductVoteToUser_B_index" ON public."_ProductVoteToUser" USING btree ("B");


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: subscription_subscription_id_entity_filters_key; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_key ON realtime.subscription USING btree (subscription_id, entity, filters);


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_admin
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: Account Account_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Admin Admin_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Admin"
    ADD CONSTRAINT "Admin_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Authenticator Authenticator_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Authenticator"
    ADD CONSTRAINT "Authenticator_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BeautyInfoPostLike BeautyInfoPostLike_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BeautyInfoPostLike"
    ADD CONSTRAINT "BeautyInfoPostLike_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."BeautyInfoPost"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ClientPost ClientPost_clientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ClientPost"
    ADD CONSTRAINT "ClientPost_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES public."Client"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Client Client_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Client"
    ADD CONSTRAINT "Client_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Comment Comment_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."ClientPost"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Comment Comment_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PostLike PostLike_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PostLike"
    ADD CONSTRAINT "PostLike_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."ClientPost"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PostLike PostLike_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PostLike"
    ADD CONSTRAINT "PostLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PostTaggedProduct PostTaggedProduct_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PostTaggedProduct"
    ADD CONSTRAINT "PostTaggedProduct_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."ClientPost"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PostTaggedProduct PostTaggedProduct_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PostTaggedProduct"
    ADD CONSTRAINT "PostTaggedProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ProductLike ProductLike_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductLike"
    ADD CONSTRAINT "ProductLike_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ProductLike ProductLike_userEmail_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductLike"
    ADD CONSTRAINT "ProductLike_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES public."User"(email) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ProductVote ProductVote_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductVote"
    ADD CONSTRAINT "ProductVote_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Review Review_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Review Review_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Session Session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Staff Staff_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Staff"
    ADD CONSTRAINT "Staff_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Task Task_assignedTo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Task"
    ADD CONSTRAINT "Task_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES public."Staff"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserRecommendation UserRecommendation_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserRecommendation"
    ADD CONSTRAINT "UserRecommendation_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserRecommendation UserRecommendation_userEmail_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserRecommendation"
    ADD CONSTRAINT "UserRecommendation_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES public."User"(email) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: _BeautyInfoPostLikeToUser _BeautyInfoPostLikeToUser_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_BeautyInfoPostLikeToUser"
    ADD CONSTRAINT "_BeautyInfoPostLikeToUser_A_fkey" FOREIGN KEY ("A") REFERENCES public."BeautyInfoPostLike"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _BeautyInfoPostLikeToUser _BeautyInfoPostLikeToUser_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_BeautyInfoPostLikeToUser"
    ADD CONSTRAINT "_BeautyInfoPostLikeToUser_B_fkey" FOREIGN KEY ("B") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _ProductVoteToUser _ProductVoteToUser_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_ProductVoteToUser"
    ADD CONSTRAINT "_ProductVoteToUser_A_fkey" FOREIGN KEY ("A") REFERENCES public."ProductVote"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _ProductVoteToUser _ProductVoteToUser_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_ProductVoteToUser"
    ADD CONSTRAINT "_ProductVoteToUser_B_fkey" FOREIGN KEY ("B") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime OWNER TO postgres;

--
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO dashboard_user;
GRANT ALL ON SCHEMA auth TO postgres;


--
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;
GRANT ALL ON SCHEMA extensions TO dashboard_user;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- Name: SCHEMA realtime; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA realtime TO postgres;
GRANT USAGE ON SCHEMA realtime TO anon;
GRANT USAGE ON SCHEMA realtime TO authenticated;
GRANT USAGE ON SCHEMA realtime TO service_role;
GRANT ALL ON SCHEMA realtime TO supabase_realtime_admin;


--
-- Name: SCHEMA storage; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT ALL ON SCHEMA storage TO postgres;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin;
GRANT ALL ON SCHEMA storage TO dashboard_user;


--
-- Name: FUNCTION email(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.email() TO dashboard_user;
GRANT ALL ON FUNCTION auth.email() TO postgres;


--
-- Name: FUNCTION jwt(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.jwt() TO postgres;
GRANT ALL ON FUNCTION auth.jwt() TO dashboard_user;


--
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.role() TO dashboard_user;
GRANT ALL ON FUNCTION auth.role() TO postgres;


--
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.uid() TO dashboard_user;
GRANT ALL ON FUNCTION auth.uid() TO postgres;


--
-- Name: FUNCTION algorithm_sign(signables text, secret text, algorithm text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.algorithm_sign(signables text, secret text, algorithm text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.algorithm_sign(signables text, secret text, algorithm text) TO dashboard_user;


--
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.armor(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO dashboard_user;


--
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO dashboard_user;


--
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.crypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.dearmor(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO dashboard_user;


--
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.digest(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO dashboard_user;


--
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gen_salt(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO dashboard_user;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.grant_pg_cron_access() FROM postgres;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO dashboard_user;


--
-- Name: FUNCTION grant_pg_graphql_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.grant_pg_graphql_access() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION grant_pg_net_access(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.grant_pg_net_access() FROM postgres;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO dashboard_user;


--
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT blk_read_time double precision, OUT blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT blk_read_time double precision, OUT blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT blk_read_time double precision, OUT blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_reset(userid oid, dbid oid, queryid bigint); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint) TO dashboard_user;


--
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO dashboard_user;


--
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgrst_ddl_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_ddl_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgrst_drop_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_drop_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION set_graphql_placeholder(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.set_graphql_placeholder() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION sign(payload json, secret text, algorithm text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.sign(payload json, secret text, algorithm text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.sign(payload json, secret text, algorithm text) TO dashboard_user;


--
-- Name: FUNCTION try_cast_double(inp text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.try_cast_double(inp text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.try_cast_double(inp text) TO dashboard_user;


--
-- Name: FUNCTION url_decode(data text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.url_decode(data text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.url_decode(data text) TO dashboard_user;


--
-- Name: FUNCTION url_encode(data bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.url_encode(data bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.url_encode(data bytea) TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v1(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v1mc(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v3(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v4(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v5(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_nil(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_nil() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_dns(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_oid(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_url(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_x500(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO dashboard_user;


--
-- Name: FUNCTION verify(token text, secret text, algorithm text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.verify(token text, secret text, algorithm text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.verify(token text, secret text, algorithm text) TO dashboard_user;


--
-- Name: FUNCTION graphql("operationName" text, query text, variables jsonb, extensions jsonb); Type: ACL; Schema: graphql_public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO postgres;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO anon;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO authenticated;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO service_role;


--
-- Name: FUNCTION get_auth(p_usename text); Type: ACL; Schema: pgbouncer; Owner: postgres
--

REVOKE ALL ON FUNCTION pgbouncer.get_auth(p_usename text) FROM PUBLIC;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO pgbouncer;


--
-- Name: FUNCTION crypto_aead_det_decrypt(message bytea, additional bytea, key_uuid uuid, nonce bytea); Type: ACL; Schema: pgsodium; Owner: pgsodium_keymaker
--

GRANT ALL ON FUNCTION pgsodium.crypto_aead_det_decrypt(message bytea, additional bytea, key_uuid uuid, nonce bytea) TO service_role;


--
-- Name: FUNCTION crypto_aead_det_encrypt(message bytea, additional bytea, key_uuid uuid, nonce bytea); Type: ACL; Schema: pgsodium; Owner: pgsodium_keymaker
--

GRANT ALL ON FUNCTION pgsodium.crypto_aead_det_encrypt(message bytea, additional bytea, key_uuid uuid, nonce bytea) TO service_role;


--
-- Name: FUNCTION crypto_aead_det_keygen(); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

GRANT ALL ON FUNCTION pgsodium.crypto_aead_det_keygen() TO service_role;


--
-- Name: FUNCTION apply_rls(wal jsonb, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO postgres;
GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO dashboard_user;


--
-- Name: FUNCTION build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO postgres;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO anon;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO service_role;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION "cast"(val text, type_ regtype); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO postgres;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO dashboard_user;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO anon;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO authenticated;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO service_role;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO supabase_realtime_admin;


--
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO anon;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO authenticated;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO service_role;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO supabase_realtime_admin;


--
-- Name: FUNCTION is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO postgres;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO anon;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO service_role;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION quote_wal2json(entity regclass); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO postgres;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO anon;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO authenticated;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO service_role;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO supabase_realtime_admin;


--
-- Name: FUNCTION send(payload jsonb, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO dashboard_user;


--
-- Name: FUNCTION subscription_check_filters(); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO postgres;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO dashboard_user;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO anon;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO authenticated;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO service_role;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO supabase_realtime_admin;


--
-- Name: FUNCTION to_regrole(role_name text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO postgres;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO anon;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO authenticated;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO service_role;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO supabase_realtime_admin;


--
-- Name: FUNCTION topic(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.topic() TO postgres;
GRANT ALL ON FUNCTION realtime.topic() TO dashboard_user;


--
-- Name: FUNCTION can_insert_object(bucketid text, name text, owner uuid, metadata jsonb); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) TO postgres;


--
-- Name: FUNCTION extension(name text); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.extension(name text) TO postgres;


--
-- Name: FUNCTION filename(name text); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.filename(name text) TO postgres;


--
-- Name: FUNCTION foldername(name text); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.foldername(name text) TO postgres;


--
-- Name: FUNCTION get_size_by_bucket(); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.get_size_by_bucket() TO postgres;


--
-- Name: FUNCTION list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text) TO postgres;


--
-- Name: FUNCTION list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text) TO postgres;


--
-- Name: FUNCTION operation(); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.operation() TO postgres;


--
-- Name: FUNCTION search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) TO postgres;


--
-- Name: FUNCTION update_updated_at_column(); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.update_updated_at_column() TO postgres;


--
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.audit_log_entries TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.audit_log_entries TO postgres;
GRANT SELECT ON TABLE auth.audit_log_entries TO postgres WITH GRANT OPTION;


--
-- Name: TABLE flow_state; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.flow_state TO postgres;
GRANT SELECT ON TABLE auth.flow_state TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.flow_state TO dashboard_user;


--
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.identities TO postgres;
GRANT SELECT ON TABLE auth.identities TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.identities TO dashboard_user;


--
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.instances TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.instances TO postgres;
GRANT SELECT ON TABLE auth.instances TO postgres WITH GRANT OPTION;


--
-- Name: TABLE mfa_amr_claims; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.mfa_amr_claims TO postgres;
GRANT SELECT ON TABLE auth.mfa_amr_claims TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.mfa_amr_claims TO dashboard_user;


--
-- Name: TABLE mfa_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.mfa_challenges TO postgres;
GRANT SELECT ON TABLE auth.mfa_challenges TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.mfa_challenges TO dashboard_user;


--
-- Name: TABLE mfa_factors; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.mfa_factors TO postgres;
GRANT SELECT ON TABLE auth.mfa_factors TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.mfa_factors TO dashboard_user;


--
-- Name: TABLE one_time_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.one_time_tokens TO postgres;
GRANT SELECT ON TABLE auth.one_time_tokens TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.one_time_tokens TO dashboard_user;


--
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.refresh_tokens TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.refresh_tokens TO postgres;
GRANT SELECT ON TABLE auth.refresh_tokens TO postgres WITH GRANT OPTION;


--
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO dashboard_user;
GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO postgres;


--
-- Name: TABLE saml_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.saml_providers TO postgres;
GRANT SELECT ON TABLE auth.saml_providers TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.saml_providers TO dashboard_user;


--
-- Name: TABLE saml_relay_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.saml_relay_states TO postgres;
GRANT SELECT ON TABLE auth.saml_relay_states TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.saml_relay_states TO dashboard_user;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.schema_migrations TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.schema_migrations TO postgres;
GRANT SELECT ON TABLE auth.schema_migrations TO postgres WITH GRANT OPTION;


--
-- Name: TABLE sessions; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.sessions TO postgres;
GRANT SELECT ON TABLE auth.sessions TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.sessions TO dashboard_user;


--
-- Name: TABLE sso_domains; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.sso_domains TO postgres;
GRANT SELECT ON TABLE auth.sso_domains TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.sso_domains TO dashboard_user;


--
-- Name: TABLE sso_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.sso_providers TO postgres;
GRANT SELECT ON TABLE auth.sso_providers TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.sso_providers TO dashboard_user;


--
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.users TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.users TO postgres;
GRANT SELECT ON TABLE auth.users TO postgres WITH GRANT OPTION;


--
-- Name: TABLE pg_stat_statements; Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE extensions.pg_stat_statements TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE extensions.pg_stat_statements TO dashboard_user;


--
-- Name: TABLE pg_stat_statements_info; Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE extensions.pg_stat_statements_info TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE extensions.pg_stat_statements_info TO dashboard_user;


--
-- Name: TABLE decrypted_key; Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE pgsodium.decrypted_key TO pgsodium_keyholder;


--
-- Name: TABLE masking_rule; Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE pgsodium.masking_rule TO pgsodium_keyholder;


--
-- Name: TABLE mask_columns; Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE pgsodium.mask_columns TO pgsodium_keyholder;


--
-- Name: TABLE messages; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE realtime.messages TO postgres;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE realtime.messages TO dashboard_user;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO anon;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO authenticated;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO service_role;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE realtime.schema_migrations TO postgres;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE realtime.schema_migrations TO dashboard_user;
GRANT SELECT ON TABLE realtime.schema_migrations TO anon;
GRANT SELECT ON TABLE realtime.schema_migrations TO authenticated;
GRANT SELECT ON TABLE realtime.schema_migrations TO service_role;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE realtime.schema_migrations TO supabase_realtime_admin;


--
-- Name: TABLE subscription; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE realtime.subscription TO postgres;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE realtime.subscription TO dashboard_user;
GRANT SELECT ON TABLE realtime.subscription TO anon;
GRANT SELECT ON TABLE realtime.subscription TO authenticated;
GRANT SELECT ON TABLE realtime.subscription TO service_role;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE realtime.subscription TO supabase_realtime_admin;


--
-- Name: SEQUENCE subscription_id_seq; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO postgres;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO dashboard_user;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO anon;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO service_role;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO supabase_realtime_admin;


--
-- Name: TABLE buckets; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.buckets TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.buckets TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.buckets TO service_role;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.buckets TO postgres;


--
-- Name: TABLE migrations; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.migrations TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.migrations TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.migrations TO service_role;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.migrations TO postgres;


--
-- Name: TABLE objects; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.objects TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.objects TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.objects TO service_role;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.objects TO postgres;


--
-- Name: TABLE s3_multipart_uploads; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.s3_multipart_uploads TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.s3_multipart_uploads TO postgres;


--
-- Name: TABLE s3_multipart_uploads_parts; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.s3_multipart_uploads_parts TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.s3_multipart_uploads_parts TO postgres;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON SEQUENCES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON FUNCTIONS TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: pgsodium; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA pgsodium GRANT ALL ON SEQUENCES TO pgsodium_keyholder;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: pgsodium; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA pgsodium GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO pgsodium_keyholder;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: pgsodium_masks; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA pgsodium_masks GRANT ALL ON SEQUENCES TO pgsodium_keyiduser;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: pgsodium_masks; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA pgsodium_masks GRANT ALL ON FUNCTIONS TO pgsodium_keyiduser;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: pgsodium_masks; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA pgsodium_masks GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO pgsodium_keyiduser;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO service_role;


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


ALTER EVENT TRIGGER issue_graphql_placeholder OWNER TO supabase_admin;

--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


ALTER EVENT TRIGGER issue_pg_cron_access OWNER TO supabase_admin;

--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


ALTER EVENT TRIGGER issue_pg_graphql_access OWNER TO supabase_admin;

--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: postgres
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


ALTER EVENT TRIGGER issue_pg_net_access OWNER TO postgres;

--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


ALTER EVENT TRIGGER pgrst_ddl_watch OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


ALTER EVENT TRIGGER pgrst_drop_watch OWNER TO supabase_admin;

--
-- PostgreSQL database dump complete
--


-- HUSERS MENU ---------------------------------------------------------------------------------------------------------

-- Materialized View: public.vm_users_hierachies
-- DROP MATERIALIZED VIEW public.vm_users_hierachies;

CREATE MATERIALIZED VIEW public.vm_users_hierachies AS 
 SELECT u.id AS "nodeId",
    u.supervisor_id AS "parentId",
    u.name AS "nodeName",
    u.supervisor_id AS "uParent",
    u.mobile_phone AS "uPhone",
    u.role AS "uRole",
    u.created_at AS "uCreated",
    u.deleted_at AS "uDeleted",
    u.business_id AS "uBusiness"
   FROM users u
  WHERE u.name IS NOT NULL
UNION
 SELECT uv.item_id AS "nodeId",
    (uv.object_changes::json #>> '{supervisor_id,0}'::text[])::numeric AS "parentId",
    uv.object::json ->> 'name'::text AS "nodeName",
    (uv.object_changes::json #>> '{supervisor_id,0}'::text[])::numeric AS "uParent",
    u.mobile_phone AS "uPhone",
    u.role AS "uRole",
    u.created_at AS "uCreated",
    u.deleted_at AS "uDeleted",
    u.business_id AS "uBusiness"
   FROM user_versions uv,
    users u
  WHERE u.id = uv.item_id AND uv.item_type::text = 'User'::text AND uv.event::text = 'update'::text AND (uv.object_changes::json #>> '{supervisor_id,0}'::text[]) IS NOT NULL
  ORDER BY 3
WITH DATA;

ALTER TABLE public.vm_users_hierachies
  OWNER TO postgres;

-- Index: public.idx_nodeid_perent_name

-- DROP INDEX public.idx_nodeid_perent_name;

CREATE UNIQUE INDEX idx_nodeid_perent_name
  ON public.vm_users_hierachies
  USING btree
  ("nodeId", "parentId", "nodeName" COLLATE pg_catalog."default");

-----------------------------------------------------------------------------------------------------------------------------------
-- Function: public.mst_get_merch_stat(integer)
-- DROP FUNCTION public.mst_get_users_hierachies(own_uid integer, actFrom varchar(10), actTo varchar(10))

CREATE OR REPLACE FUNCTION public.mst_get_users_hierachies(own_uid integer, actFrom varchar(10), actTo varchar(10))
  RETURNS json AS
$BODY$
DECLARE 
  stat JSONB;
  _stat JSONB;
BEGIN

  with recursive temp1 (nodeId, parentId, nodeName, UParent, uRole, uPhone, uCreated, uDeleted, PATH, LEVEL) as (
    select u1.nodeId, u1.parentId, u1.nodeName, u1.uParent, u1.uRole, u1.uPhone, u1.uCreated, u1.uDeleted, CAST (u1.nodeId AS VARCHAR (50)) as PATH, 1 
    from vm_users_hierachies u1 
    where (u1.uDeleted is null or u1.uDeleted::date > $3::date) and u1.uCreated::date > $2::date and u1.nodeId =$1 -- is null
    union
    select u2.nodeId, u2.parentId, u2.nodeName, u2.UParent, u2.uRole, u2.uPhone, u2.uCreated, u2.uDeleted,  CAST (temp1.path ||'->'||u2.nodeId AS VARCHAR (50) ) as PATH, LEVEL+1 
    from vm_users_hierachies u2 INNER JOIN temp1 ON( temp1.nodeId= u2.parentId)
    where (u2.uDeleted is null or u2.uDeleted::date > $3::date) and u2.uCreated::date > $2::date
)

select regexp_replace(json_build_array(dates)::text, '^\[|\]$', '', 'g')::text dates INTO _stat from (
select (row_to_json("sHyperCube")::jsonb) "sHyperCube" from (
    select 
    (select row_to_json(subSize)::jsonb "sSize" from (
      select (select count(*) from temp1)::int as "cx", 10 as "cy"
    ) subsize),

    ( select array_agg((select row_to_json(matrix)::jsonb)) "sMatrix" from (
      select nodeId as "nodeId", 
	parentId as "parentId", 
	nodeName as "nodeName", 
	uParent as "uParent", 
	uRole as "uRole", 
	uPhone as "uPhone", 
	uCreated as "uCreated", 
	uDeleted as "uDeleted", 
	PATH as "Path", 
	LEVEL as "Level" 
      from temp1
    ) matrix)
  ) "sHyperCube"
) dates;

  select regexp_replace(_stat::text, 'null', '""', 'g') into stat;
  RETURN stat;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION public.mst_get_users_hierachies(integer)
  OWNER TO postgres;

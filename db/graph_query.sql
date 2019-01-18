-- FUNCTION: public.get_view_nodes(integer)

-- DROP FUNCTION public.get_view_nodes(integer);

CREATE OR REPLACE FUNCTION public.get_view_nodes(
	node_id integer)
    RETURNS SETOF calc_node 
    LANGUAGE 'sql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$WITH RECURSIVE cte(id, node_from_id, node_to_id) AS
(
	SELECT id, node_from_id, node_to_id FROM calc_edge WHERE node_to_id = @node_id
	UNION ALL
	SELECT c.id, c.node_from_id, c.node_to_id FROM calc_edge As c
		JOIN cte p 
		ON p.node_from_id = c.node_to_id
)
SELECT * FROM calc_node WHERE id in (SELECT node_from_id FROM cte) or id = @node_id;$BODY$;

ALTER FUNCTION public.get_view_nodes(integer)
    OWNER TO postgres;

-- FUNCTION: public.get_view_edges(integer[])

-- DROP FUNCTION public.get_view_edges(integer[]);

CREATE OR REPLACE FUNCTION public.get_view_edges(
	node_ids integer[])
    RETURNS SETOF calc_edge 
    LANGUAGE 'sql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$SELECT * FROM calc_edge WHERE node_from_id = ANY(node_ids) or node_to_id = ANY(node_ids)$BODY$;

ALTER FUNCTION public.get_view_edges(integer[])
    OWNER TO postgres;

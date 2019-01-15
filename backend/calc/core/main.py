import abc
import importlib
import itertools
import json

class FunctionBlock(abc.ABC):
    query_params = []

    def __init__(self, id, state, qual_name):
        self.id = id
        self.state = state
        self.qual_name = qual_name

    @abc.abstractmethod
    def evaluate(self, params, query={}):
        raise NotImplementedError

    @staticmethod
    def from_qualname(id, state, qual_name):
        return (lambda x,y: getattr(importlib.import_module(x), y)(id, state, qual_name))(*qual_name.rsplit('.',1))

class Graph:
    def __init__(self, nodes, edges):
        self.node_map = {
            node.id: (
                [edge.node_from.id for edge in edges if edge.node_to.id == node.id],
                (
                    {edge.node_from.id: edge.map for edge in edges if edge.node_to.id == node.id},
                    node.id,
                    node.state,
                    node.qual_name
                )
            )  for node in nodes
        }
    
    def get_query_params(self):
        l_query_params = [FunctionBlock.from_qualname(x[1][1], x[1][2], x[1][3]).query_params for x in self.node_map.values()]
        query_param_set = [json.loads(x) for x in set([json.dumps(x, sort_keys=True) for x in itertools.chain(*l_query_params)])]
        return query_param_set

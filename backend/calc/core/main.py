import abc
import importlib

class FunctionBlock(abc.ABC):
    def __init__(self, id, state, qual_name):
        self.id = id
        self.state = state
        self.qual_name = qual_name

    @abc.abstractmethod
    def evaluate(self, params):
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
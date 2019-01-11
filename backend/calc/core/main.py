import abc
import importlib

class FunctionBlock(abc.ABC):
    def __init__(self, id, state, qual_name):
        self.id = id
        self.state = state
        self.qual_name = qual_name
        self.in_nodes = []
        self.out_nodes = []
        self.value = None
        self.complete = False
        self.g = None

    @abc.abstractmethod
    def evaluate(self, params):
        raise NotImplementedError
    
    """
    def execute(self, result):
        self.value = result.result()
        self.complete = True
        for n,m in self.out_nodes:
            if all(n.complete for n,m in self.in_nodes):
    """

    @staticmethod
    def from_qualname(id, state, qual_name):
        return (lambda x,y: getattr(importlib.import_module(x), y)(id, state, qual_name))(*qual_name.rsplit('.',1))

class Graph:
    def __init__(self, nodes, edges):
        self.node_map = {n.id: FunctionBlock.from_qualname(n.id, n.state, n.qual_name) for n in nodes}
        for edge in edges:
            self.node_map[edge.node_to.id].in_nodes.append((self.node_map[edge.node_from.id], edge.map))
            self.node_map[edge.node_from.id].out_nodes.append((self.node_map[edge.node_to.id], edge.map))
        for n in self.node_map.values():
            n.g = self
    
    def run(self, query):
        self.query = query
        [n.execute() for n in self.node_map.values() if not n.in_nodes]
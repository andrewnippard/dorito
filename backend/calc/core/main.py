import abc
import importlib
from concurrent.futures import ThreadPoolExecutor

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
        self.e = None

    @abc.abstractmethod
    def evaluate(self, params):
        raise NotImplementedError
    
    def execute(self, result):
        self.value = result.result()
        self.complete = True
        for n,m in self.out_nodes:
            if all(n.complete for n,m in self.in_nodes):
            
    @staticmethod
    def from_qualname(id, state, qual_name):
        return (lambda x,y: getattr(importlib.import_module(x), y)(id, state, qual_name))(*qual_name.rsplit('.',1))

class Graph:
    def __init__(self, nodes, edges, n_threads):
        self.node_map = {n.id: n for n in nodes}
        self.e = ThreadPoolExecutor(n_threads)
        for edge in edges:
            self.node_map[edge[1]].in_nodes.append((self.node_map[edge[0]], edge[2]))
            self.node_map[edge[0]].out_nodes.append((self.node_map[edge[1]], edge[2]))
        for n in self.node_map.values():
            n.g = self
            n.e = self.e 
    
    def run(self, query):
        self.query = query
        [n.execute() for n in self.node_map.values() if not n.in_nodes]
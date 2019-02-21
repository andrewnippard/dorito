import abc
import importlib
import itertools
import json
import re
from .parsers import FunctionBlockParser
from .processors import FunctionBlockProcessor

class FunctionBlock(abc.ABC):
    @property
    @abc.abstractmethod
    def inputs(self): raise NotImplementedError
    
    @property
    @abc.abstractmethod
    def outputs(self): raise NotImplementedError
    
    @property
    @abc.abstractmethod
    def query_params(self): raise NotImplementedError
    
    @property
    @abc.abstractmethod
    def doc(self): raise NotImplementedError

    preprocessing = []
    postprocessing = []

    def __init__(self, id, state, qual_name, preprocessing, postprocessing):
        self.id = id
        self.state = state
        self.qual_name = qual_name
        self.instance_preprocessing = preprocessing
        self.instance_postprocessing = postprocessing

    @abc.abstractmethod
    def evaluate(self, params, query={}):
        raise NotImplementedError

    @staticmethod
    def from_qualname(id, state, qual_name, preprocessing, postprocessing):
        return (lambda x,y: getattr(importlib.import_module(x), y)(id, state, qual_name, preprocessing, postprocessing))(*qual_name.rsplit('.',1))

    def run(self, msg, query_params):
        msg_pre = self.run_msg_preprocessing(msg)
        static_pre = self.run_static_preprocessing(msg_pre)
        instance_pre = self.run_instance_preprocessing(static_pre)
        result = self.evaluate(instance_pre, query_params)
        instance_post = self.run_instance_postprocessing(result)
        static_post = self.run_static_postprocessing(instance_post)
        msg_post = self.run_msg_postprocessing(static_post)
        return msg_post
    
    def run_msg_preprocessing(self, msg):
        for k,v in msg.items():
            parser = FunctionBlockParser.get_parser(next(x['type'] for x in self.inputs if re.match(x['pattern'], k)))
            msg[k] = parser.loads(v)
        return msg

    def run_static_preprocessing(self, msg):
        for step in self.preprocessing:
            msg = step.evaluate(msg)
        return msg

    def run_instance_preprocessing(self, msg):
        for step in self.instance_preprocessing:
            msg = FunctionBlockProcessor.from_qualname(**step).evaluate(msg)
        return msg

    def run_instance_postprocessing(self, result):
        for step in self.instance_postprocessing:
            result = FunctionBlockProcessor.from_qualname(**step).evaluate(result)
        return result
    
    def run_static_postprocessing(self, result):
        for step in self.postprocessing:
            result = step.evaluate(result)
        return result
    
    def run_msg_postprocessing(self, result):
        for k,v in result.items():
            parser = FunctionBlockParser.get_parser(next(x['type'] for x in self.outputs if re.match(x['pattern'], k)))
            if parser:
                result[k] = parser.dumps(v)
        return result

class Graph:
    def __init__(self, nodes, edges):
        self.node_map = {
            node.id: (
                [edge.node_from.id for edge in edges if edge.node_to.id == node.id],
                (
                    {edge.node_from.id: edge.map for edge in edges if edge.node_to.id == node.id},
                    node.id,
                    node.state,
                    node.qual_name,
                    node.preprocessing,
                    node.postprocessing
                )
            )  for node in nodes
        }
    
    def get_query_params(self):
        l_query_params = [FunctionBlock.from_qualname(x[1][1], x[1][2], x[1][3], x[1][4], x[1][5]).query_params for x in self.node_map.values()]
        query_param_set = [json.loads(x) for x in set([json.dumps(x, sort_keys=True) for x in itertools.chain(*l_query_params)])]
        return query_param_set

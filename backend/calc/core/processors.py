import abc
import importlib
import pandas
import re

class FunctionBlockProcessor(abc.ABC):
    def __init__(self, pattern, state):
        self.pattern = pattern
        self.state = state
    
    @abc.abstractmethod
    def evaluate(self, params):
        raise NotImplementedError

    @staticmethod
    def from_qualname(qual_name, pattern, state):
        return (lambda x,y: getattr(importlib.import_module(x), y)(pattern, state))(*qual_name.rsplit('.',1))

class PandasDataFrameColumnMapper(FunctionBlockProcessor):
    def evaluate(self, params):
        for k,v in params.items():
            if re.match(self.pattern, k):
                params[k] = v.rename(columns=self.state['columns'])
        return params

class PandasDataFrameJoin(FunctionBlockProcessor):
    def evaluate(self, params):
        ret_val = params.copy()
        df = pandas.DataFrame()
        for k,v in params.items():
            if re.match(self.pattern, k):
                if df.empty:
                    df = v
                else:
                    df = df.join(v)
                ret_val.pop(k)
        ret_val[self.state['output']] = df
        return ret_val
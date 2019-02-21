import abc
import pandas
import datetime

class FunctionBlockParser(abc.ABC):
    @abc.abstractmethod
    def loads(self, msg):
        raise NotImplementedError
    
    @abc.abstractmethod
    def dumps(self, obj):
        raise NotImplementedError

    @staticmethod
    def get_parser(data_type):
        return {
            'pandas.DataFrame': PandasParser()
        }.get(data_type, None)

class PandasParser(FunctionBlockParser):
    def loads(self, msg):
        return pandas.read_json(msg, orient='split')
    
    def dumps(self, obj):
        return obj.to_json(orient='split')

from calc.core import FunctionBlock
import pandas
import time
import datetime

class CSVReader(FunctionBlock):
    query_params = []
    inputs = []
    outputs = [
        {
            'pattern': '^output$',
            'type': 'pandas.DataFrame'
        }
    ]
    doc = """CSV reader"""

    def evaluate(self, params, query={}):
        df = pandas.read_csv(self.state['file_path'])
        if 'index' in self.state:
            use_datetime_index = self.state.get('datetime_index', False)
            if use_datetime_index:
                df = df.set_index(pandas.DatetimeIndex(df[self.state['index']]))[[n for n in df.columns if n != self.state['index']]]
            else:
                df.set_index(self.state['index'], inplace=True)
        return {
            'output': df
        }
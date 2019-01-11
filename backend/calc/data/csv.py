from calc.core import FunctionBlock
import pandas
import time

class CSVReader(FunctionBlock):
    def evaluate(self, params):
        time.sleep(1)
        df = pandas.read_csv(self.state['file_path'])
        if 'index' in self.state:
            df.set_index(self.state['index'], inplace=True)
        return {
            'output': df.to_json(orient='split')
        }
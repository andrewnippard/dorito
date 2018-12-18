from calc.core import FunctionBlock
import csv
import time

class CSVReader(FunctionBlock):
    def evaluate(self, params):
        time.sleep(5)
        with open(self.state['file_path'], 'r') as csvfile:
            reader = csv.reader(csvfile, delimiter=',')
            return {
                'output': [{
                    'ts': x[0],
                    'value': float(x[1])
                } for x in [row for row in reader][1:]]
            }
                
        
from calc.core import FunctionBlock
from calc.types import TimeValue
import csv
from datetime import datetime

class CSVReader(FunctionBlock):
    def evaluate(self, params):
        with open(self.state['file_path'], 'r') as csvfile:
            reader = csv.reader(csvfile, delimiter=',')
            return [TimeValue(datetime.strptime(x[0], '%Y-%m-%dT%H:%M:%S.%fZ'), float(x[1])) for x in [row for row in reader][1:]]
                
        
from calc.core import FunctionBlock
import csv
import time

class CSVReader(FunctionBlock):
    def evaluate(self, params):
        time.sleep(5)
        with open(self.state['file_path'], 'r') as csvfile:
            reader = csv.reader(csvfile, delimiter=',')
            return {
                'schemas': [
                    {
                        'id': 1,
                        'columns': [
                            {
                                'name': 'ts',
                                'type': 'datetime'
                            },
                            {
                                'name': 'value',
                                'type': 'float'
                            }
                        ]
                    }
                ],
                'data': [
                    {
                        'schema': 1,
                        'name': 'output',
                        'values': list(map(list, zip(*[[x[0], float(x[1])] for x in [row for row in reader][1:]])))
                    }
                ]
            }
                
        
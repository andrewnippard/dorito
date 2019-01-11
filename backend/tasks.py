import celery
import pandas
import abc
import importlib
from calc.core import FunctionBlock
from collections import ChainMap
import json

app = celery.Celery('app', broker='redis://localhost:6379/0', backend='redis://localhost:6379/1')

class TestBlock(FunctionBlock):
    def evaluate(self, params):
        p = pandas.read_json(params['p'], orient='split').rename(columns={'value': 'p'})
        t = pandas.read_json(params['t'], orient='split').rename(columns={'value': 't'})
        df = p.join(t)
        df['h'] = df.p * df.t
        return {
            'h': df[['h']].to_json(orient='split')
        }

@app.task(bind=True)
def run_fb(self, params, map, id, state, qual_name):
    past_result = self.backend.get(self.backend.get_key_for_task(self.request.id))
    if past_result:
        print('Using cached value for task {}'.format(self.request.id))
        return json.loads(past_result)['result']
    fb = FunctionBlock.from_qualname(id, state, qual_name)
    ret_val = fb.evaluate(params)
    return {
        map[k]: v for k,v in ret_val.items()
    }

@app.task(bind=True)
def collect_msgs(self, msgs):
    return dict(ChainMap(*msgs))
    


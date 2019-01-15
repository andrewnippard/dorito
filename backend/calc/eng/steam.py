from iapws import IAPWS97
from calc.core import FunctionBlock
import pandas

class SteamPTH(FunctionBlock):
    def evaluate(self, params, query):
        p = pandas.read_json(params['p'], orient='split').rename(columns={'value': 'p'})
        t = pandas.read_json(params['t'], orient='split').rename(columns={'value': 't'})
        df = p.join(t)
        df.p = df.p * 0.00689476
        df.t = ((df.t - 32) * (5/9)) + 273.15
        df['h'] = df.apply(lambda s: IAPWS97(P=s.p, T=s.t).h, axis=1)
        df.h = df.h * 0.429923
        return {
            'h': df[['h']].to_json(orient='split')
        }
import datetime
from calc.core import FunctionBlock
import pandas


class TableSerializer(FunctionBlock):
    query_params = []
    inputs = [
        {
            'pattern': '(.*?)',
            'type': 'pandas.DataFrame'
        }
    ]
    outputs = [
        {
            'pattern': '^output$',
            'type': 'dict'
        }
    ]
    doc = """Table serializer"""

    def evaluate(self, params, query):
        # Pandas type map
        pandas_type_map = {
            'int64': ('int', lambda x: int(x)),
            'float64': ('float', lambda x: float(x)),
            'datetime64[ns]': ('datetime', lambda x: datetime.datetime.strftime(x, '%Y-%m-%dT%H:%M:%S.%fZ'))
        }
        
        # Start with empty return value
        ret_val = {
            "schemas": [],
            "data": []
        }
        
        # For each table, populate schema entry & data entry
        for df_idx, (name, df) in enumerate(params.items(), 1):
            schema = {
                "id": df_idx,
                "index": {
                    "name": df.index.name if df.index.name else 'index',
                    "type": pandas_type_map.get(df.index.dtype.name, 'object')[0]
                },
                "columns": [
                    {
                        "name": df_col,
                        "type": pandas_type_map.get(df.dtypes[df_col].name)[0]
                    } for df_col in df.columns
                ]
            }
            if not schema in ret_val['schemas']:
                ret_val['schemas'].append(schema)
                schema_id = schema['id']
            else:
                schema_id = next(y['id'] for y in ret_val['schemas'] if y == schema)
            data = {
                "schema": schema_id,
                "name": name,
                "index": df.index.map(lambda x: pandas_type_map[df.index.dtype.name][1](x)).values.tolist(),
                "values": df.apply(lambda x: list(map(pandas_type_map[x.dtype.name][1], x)), axis=1, result_type='reduce').values.tolist()
            }
            ret_val['data'].append(data)
            
        return {
            'output': ret_val
        }
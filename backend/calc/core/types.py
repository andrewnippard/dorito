import datetime
from calc.core import FunctionBlock
import pandas

def parse_value(value, type):
    return {
        'datetime': lambda x: datetime.datetime.strptime(x, '%Y-%m-%dT%H:%M:%S.%fZ'),
        'float': lambda x: float(x),
        'string': lambda x: str(x)
    }[type](value)

def parse_result(result):
    # Load schemas
    schemas = {
        schema['id']: schema['columns'] for schema in result['schemas']
    }

    # Parse tables
    ret_val = {}
    for table in result['data']:
        schema_names = [x['name'] for x in schemas[table['schema']]]
        schema_types = [x['type'] for x in schemas[table['schema']]]
        ret_val.update({table['name']: [dict(zip(schema_names, (parse_value(y, schema_types[idx]) for idx, y in enumerate(x)))) for x in list(zip(*table['values']))]})
    
    # Return result
    return ret_val

class TableSerializer(FunctionBlock):
    def evaluate(self, params):
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
        for df_idx, (name, df_json) in enumerate(params.items(), 1):
            df = pandas.read_json(df_json, orient='split')
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
            
        return ret_val
import datetime

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

def parse_result_json(result):
    # Load schemas
    schemas = {
        schema['id']: schema['columns'] for schema in result['schemas']
    }

    # Parse tables
    ret_val = {}
    for table in result['data']:
        schema_names = [x['name'] for x in schemas[table['schema']]]
        ret_val.update({table['name']: [dict(zip(schema_names, x)) for x in list(zip(*table['values']))]})
    
    # Return result
    return ret_val
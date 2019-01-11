from tasks import TestBlock, run_fb, collect_msgs
from celery import chain, chord
from celery.canvas import chain, group, Signature
from celery.utils.graph import DependencyGraph
from uuid import uuid4

a = run_fb.s({}, {'output': 'p'}, 1, {'file_path': '/Users/anippard/Programming/jabberwocky/data/sensors/msp.csv', 'index': 'ts'}, 'calc.data.csv.CSVReader')
b = run_fb.s({}, {'output': 't'}, 2, {'file_path': '/Users/anippard/Programming/jabberwocky/data/sensors/mst.csv', 'index': 'ts'}, 'calc.data.csv.CSVReader')
c = run_fb.s({'h': 'h'}, 3, {}, 'tasks.TestBlock')
a.id = str(uuid4())
b.id = str(uuid4())
c.id = str(uuid4())

g = {
    'a': ([], a),
    'b': ([], b),
    'c': (['a', 'b'], c)
}

def graph_to_canvas(g, t):
    def traverse(g, t, r):
        l_ni, e_n = g[t]
        if l_ni:
            for e_ni in l_ni:
                traverse(g, e_ni, r)
            if len(l_ni) == 1:
                r[t] = chain([e_ni, e_n])
            else:
                r[t] = chain([chord([r[x] for x in l_ni], collect_msgs.s()), e_n])
        else:
            r[t] = e_n
        return r
    
    r = {k: None for k in g.keys()}
    return traverse(g, t, r)[t]

canvas = graph_to_canvas(g, 'c')
print(canvas)
print(canvas().get())
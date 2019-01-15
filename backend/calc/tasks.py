from __future__ import absolute_import, unicode_literals
from celery.task import task
from celery import chain, chord
from calc.core.main import FunctionBlock
from collections import ChainMap
import json

def graph_to_canvas(g, t, q):
    def traverse(g, t, r):
        in_nodes, args = g[t]
        if in_nodes:
            for in_node in in_nodes:
                traverse(g, in_node, r)
            node_task = run_fb.s(*args, query=q)
            if len(in_nodes) == 1:
                r[t] = chain([r[in_nodes[0]], node_task])
            else:
                r[t] = chain([chord([r[in_node] for in_node in in_nodes], collect_msgs.s()), node_task])
        else:
            node_task = run_fb.s({}, *args, query=q)
            r[t] = node_task
        return r

    r = {k: None for k in g.keys()}
    return traverse(g, t, r)[t]

@task(bind=True)
def run_fb(self, params, mappings, id, state, qual_name, query):
    # Refactor params by map
    params = dict(ChainMap(*[{mappings[k1][k2]: v2 for k2, v2 in v1.items()} for k1,v1 in params.items()]))
    past_result = self.backend.get(self.backend.get_key_for_task(self.request.id))
    if past_result:
        print('Using cached value for task {}'.format(self.request.id))
        return json.loads(past_result)['result']
    return {
        id: FunctionBlock.from_qualname(id, state, qual_name).evaluate(params, query)
    }

@task(bind=True)
def collect_msgs(self, msgs):
    return dict(ChainMap(*msgs))
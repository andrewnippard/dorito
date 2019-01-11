from __future__ import absolute_import, unicode_literals
from celery import task, chain, chord
from calc.core.main import FunctionBlock
from collections import ChainMap
import json

def graph_to_canvas(g, t):
    def traverse(g, t, r):
        node = g[t]
        if node.in_nodes:
            for in_node, in_node_map  in node.in_nodes:
                traverse(g, in_node.id, r)
            node_task = run_fb.s(in_node_map, node.id, node.state, node.qual_name)
            if len(node.in_nodes) == 1:
                r[t] = chain([r[node.in_nodes[0].id], node_task])
            else:
                r[t] = chain([chord([r[in_node.id] for in_node, in_node_map in node.in_nodes], collect_msgs.s()), node_task])
        else:
            node_task = run_fb.s({}, {}, node.id, node.state, node.qual_name)
            r[t] = node_task
        return r
    print(g)
    print(t)
    r = {k: None for k in g.keys()}
    return traverse(g, t, r)[t]

@task(bind=True)
def run_fb(self, params, map, id, state, qual_name):
    past_result = self.backend.get(self.backend.get_key_for_task(self.request.id))
    if past_result:
        print('Using cached value for task {}'.format(self.request.id))
        return json.loads(past_result)['result']
    fb = FunctionBlock.from_qualname(id, state, qual_name)
    fb = None
    ret_val = fb.evaluate(params)
    return {
        map[k]: v for k,v in ret_val.items()
    }

@task(bind=True)
def collect_msgs(self, msgs):
    return dict(ChainMap(*msgs))
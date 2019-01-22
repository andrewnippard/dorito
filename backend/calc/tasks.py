from __future__ import absolute_import, unicode_literals
from celery.task import task
from celery import chain, chord
from calc.core.main import FunctionBlock
from collections import ChainMap
import json
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

def send_msg_to_socket(node_run_id, msg):
    layer = get_channel_layer()
    async_to_sync(layer.group_send)('node_run_%s' % node_run_id, {
        'type': 'node_run_message',
        'message': msg
    })

def graph_to_canvas(g, t, q, n):
    def traverse(g, t, r):
        in_nodes, args = g[t]
        if in_nodes:
            for in_node in in_nodes:
                traverse(g, in_node, r)
            node_task = run_fb.s(*args, query=q, node_run_id=n)
            if len(in_nodes) == 1:
                r[t] = chain([r[in_nodes[0]], node_task])
            else:
                r[t] = chain([chord([r[in_node] for in_node in in_nodes], collect_msgs.s()), node_task])
        else:
            node_task = run_fb.s({}, *args, query=q, node_run_id=n)
            r[t] = node_task
        return r

    r = {k: None for k in g.keys()}
    return traverse(g, t, r)[t]

@task(bind=True)
def run_fb(self, params, mappings, id, state, qual_name, query, node_run_id):
    # Starting 
    send_msg_to_socket(node_run_id, json.dumps({
        'node_run_id': node_run_id,
        'status': 'Started'
    }))

    # Refactor params by map
    params = dict(ChainMap(*[{mappings[k1][k2]: v2 for k2, v2 in v1.items()} for k1,v1 in params.items()]))
    past_result = self.backend.get(self.backend.get_key_for_task(self.request.id))
    if past_result:
        print('Using cached value for task {}'.format(self.request.id))
        return json.loads(past_result)['result']
    ret_val = FunctionBlock.from_qualname(id, state, qual_name).evaluate(params, query)
    send_msg_to_socket(node_run_id, json.dumps({
        'node_run_id': node_run_id,
        'status': 'Completed'
    }))
    return {
        id: ret_val
    }

@task(bind=True)
def collect_msgs(self, msgs):
    return dict(ChainMap(*msgs))
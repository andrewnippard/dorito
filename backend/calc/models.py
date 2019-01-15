from django.db import models, connection
from django.contrib.postgres.fields import JSONField
import psycopg2.extras

# Create your models here.
class Node(models.Model):
    description = models.CharField(max_length=256)
    description_verbose = models.CharField(max_length=256)
    qual_name = models.CharField(max_length=64)
    state = JSONField()
    doc = models.TextField()

    @staticmethod
    def get_view_nodes(node_id):
        with connection.connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as crsr:
            crsr.execute('SELECT * FROM get_view_nodes(%s)', (node_id,))
            rows = crsr.fetchall()
        return [Node(**row) for row in rows]

    def __str__(self):
        return self.description

class Edge(models.Model):
    node_from = models.ForeignKey(Node, on_delete=models.CASCADE, related_name='fk_node_from')
    node_to = models.ForeignKey(Node, on_delete=models.CASCADE, related_name='fk_node_to')
    map = JSONField()

    @staticmethod
    def get_view_edges(node_ids):
        with connection.connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as crsr:
            crsr.execute('SELECT * FROM get_view_edges(%s)', (node_ids,))
            rows = crsr.fetchall()
        return [Edge(**row) for row in rows]

    def __str__(self):
        return "[{}]->[{}]".format(self.node_from.description, self.node_to.description)

class NodeRun(models.Model):
    node = models.ForeignKey(Node, on_delete=models.CASCADE, related_name='fk_node')
    query = JSONField()
    status = models.IntegerField()
    result = JSONField(null=True)

    def __str__(self):
        return self.node.description + ' Run'

class QueryParameter(object):
    def __init__(self, name, type):
        self.name = name
        self.type = type
from django.db import models
from django.contrib.postgres.fields import JSONField

# Create your models here.
class Node(models.Model):
    description = models.CharField(max_length=256)
    description_verbose = models.CharField(max_length=256)
    qual_name = models.CharField(max_length=64)
    state = JSONField()
    doc = models.TextField()

    def __str__(self):
        return self.description

class Edge(models.Model):
    node_from = models.ForeignKey(Node, on_delete=models.CASCADE, related_name='fk_node_from')
    node_to = models.ForeignKey(Node, on_delete=models.CASCADE, related_name='fk_node_to')
    map = JSONField()

    def __str__(self):
        return "[{}]->[{}]".format(node_from.description, node_to.description)
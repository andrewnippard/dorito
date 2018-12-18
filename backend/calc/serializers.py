from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .models import Node, Edge, NodeRun

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'groups')

class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')

class NodeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Node
        fields = ('id', 'url', 'description', 'description_verbose', 'qual_name', 'state', 'doc')

class EdgeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Edge
        fields = ('id', 'url', 'node_from', 'node_to', 'map')

class NodeRunSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = NodeRun
        fields = ('id', 'url', 'node', 'query', 'status', 'result')
from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .models import Node, Edge, NodeRun, NodeResult, QueryParameter

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

class NodeResultSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = NodeResult
        fields = ('id', 'url', 'node_run', 'result')

class QueryPlanGraphNodeSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = Node
        fields = ('id', 'description', 'description_verbose', 'qual_name', 'state', 'doc')

class QueryPlanGraphEdgeSerializer(serializers.ModelSerializer):
    node_from = serializers.PrimaryKeyRelatedField(queryset=Node.objects.all())
    node_to = serializers.PrimaryKeyRelatedField(queryset=Node.objects.all())

    class Meta:
        model = Edge
        fields = ('id', 'node_from', 'node_to', 'map')

class QueryPlanGraphSerializer(serializers.Serializer):
    nodes = QueryPlanGraphNodeSerializer(many=True)
    edges = QueryPlanGraphEdgeSerializer(many=True)

class QueryParameterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=256)
    type = serializers.CharField(max_length=256)

class QueryPlanSerializer(serializers.Serializer):
    graph = QueryPlanGraphSerializer()
    query_parameters = QueryParameterSerializer(many=True)


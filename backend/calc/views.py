from django.shortcuts import render, HttpResponse, get_object_or_404
from django.contrib.auth.models import User, Group
from django.core.exceptions import ObjectDoesNotExist

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.status import HTTP_201_CREATED, HTTP_200_OK, HTTP_304_NOT_MODIFIED, HTTP_500_INTERNAL_SERVER_ERROR

from .serializers import *
from .models import Node, Edge, NodeRun, QueryParameter
from .core import FunctionBlock, Graph
from .tasks import graph_to_canvas

import threading
import time
import pandas
import traceback

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class NodeViewSet(viewsets.ModelViewSet):
    queryset = Node.objects.all()
    serializer_class = NodeSerializer

    @action(detail=True, methods=['post'])
    def run(self, request, pk=None):
        # Get node and query
        node = Node.objects.get(pk=pk)
        query = request.data
        
        # Check if NodeRun exists with same node and query - if yes, return that result, else run graph
        try:
            node_run = NodeRun.objects.get(node=node, query=query, status=2)
            status = HTTP_200_OK
            print('Found cached result...')
        except ObjectDoesNotExist:
            print('Running graph...')
            node_run = NodeRun.objects.create(node=node, query=query, status=1, result=None)

            # Create graph
            graph_nodes = Node.get_view_nodes(pk)
            graph_edges = Edge.get_view_edges([n.id for n in graph_nodes])
            g = Graph(graph_nodes, graph_edges)

            # Compile graph to Celery canvas
            canvas = graph_to_canvas(g.node_map, node_run.node.id, query, node_run.id)

            # Get canvas result and update status to complete (2)
            try:
                result = canvas().get()[str(node.id)]
                node_run.result = result
                node_run.status = 2
                node_run.save()
                status = HTTP_201_CREATED
            # On exception, update status to 3 and set result to error
            except Exception as e:
                node_run.result = {
                    'error_msg': str(e),
                    'traceback': traceback.format_exc()
                }
                node_run.status = 3
                node_run.save()
                status = HTTP_304_NOT_MODIFIED

        # Serialize and return with location header
        serializer = NodeRunSerializer(node_run, many=False, context={'request': request})
        response = Response(serializer.data, status=status)
        response['Location'] = str(serializer.data['url'])
        return response

    @action(detail=True, methods=['get'])
    def query_plan(self, request, pk=None):
        # Create graph
        node = Node.objects.get(pk=pk)
        graph_nodes = Node.get_view_nodes(node.id)
        graph_edges = Edge.get_view_edges([n.id for n in graph_nodes])
        g = Graph(graph_nodes, graph_edges)

        # Get query graph and parameters
        query_graph = QueryPlanGraphSerializer(data={
            'nodes': QueryPlanGraphNodeSerializer(graph_nodes, many=True).data,
            'edges': QueryPlanGraphEdgeSerializer(graph_edges, many=True).data
        })
        query_parameters = QueryParameterSerializer([QueryParameter(**x) for x in g.get_query_params()], many=True)

        if query_graph.is_valid():
            serializer = QueryPlanSerializer(data={
                'graph': query_graph.data,
                'query_parameters': query_parameters.data,
            })
            if serializer.is_valid():
                response = Response(serializer.data, status=HTTP_200_OK)
            else:
                response = Response(status=HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            response = Response(status=HTTP_500_INTERNAL_SERVER_ERROR)
        return response

class EdgeViewSet(viewsets.ModelViewSet):
    queryset = Edge.objects.all()
    serializer_class = EdgeSerializer

class NodeRunViewSet(viewsets.ModelViewSet):
    queryset = NodeRun.objects.get_queryset().order_by('-id')
    serializer_class = NodeRunSerializer

# Create your views here.
def index(request):
    return render(request, 'calc/index.html')
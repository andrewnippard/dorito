from django.shortcuts import render, HttpResponse, get_object_or_404
from django.contrib.auth.models import User, Group

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.status import HTTP_201_CREATED

from .serializers import UserSerializer, GroupSerializer, NodeSerializer, EdgeSerializer, NodeRunSerializer
from .models import Node, Edge, NodeRun
from .core import FunctionBlock

import threading

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
        # Create node
        node = Node.objects.get(pk=pk)
        query = request.data.get('query', {})
        status = 0
        result = None
        node_run = NodeRun.objects.create(node=node, query=query, status=status, result=result)

        # Run code asynchronously, pass node_run object to allow for status and result update
        def async_eval(node_run, fb, query):
            # Set status to 1
            node_run.status = 1
            node_run.save()

            # Execute function block w/ query
            try:
                node_run.result = fb.evaluate({})
                node_run.status = 2
            except:
                node_run.status = 3
            node_run.save()

        t = threading.Thread(
            target=async_eval,
            args=(
                node_run,
                FunctionBlock.from_qualname(node.id, node.state, node.qual_name),
                query
            )
        )
        t.start()

        # Serialize and return with location header
        serializer = NodeRunSerializer(node_run, many=False, context={'request': request})
        response = Response(serializer.data, status=HTTP_201_CREATED)
        response['Location'] = str(serializer.data['url'])
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
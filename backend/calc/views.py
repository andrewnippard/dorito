from django.shortcuts import render, HttpResponse, get_object_or_404
from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from rest_framework.response import Response
from .serializers import UserSerializer, GroupSerializer, NodeSerializer, EdgeSerializer, TimeValueSerializer
from .models import Node, Edge
from .core import FunctionBlock

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

class EdgeViewSet(viewsets.ModelViewSet):
    queryset = Edge.objects.all()
    serializer_class = EdgeSerializer

class NodeResultViewSet(viewsets.ViewSet):
    def retrieve(self, request, pk=None):
        node = Node.objects.get(pk=pk)
        serializer = TimeValueSerializer(FunctionBlock.from_qualname(node.id, node.state, node.qual_name).evaluate({}), many=True)
        return Response(serializer.data)

class GraphNodeResultViewSet(viewsets.ViewSet):
    def retrieve(self, request, pk=None):
        g = Graph(Node.objects.all(), Edge.objects.all())
        serializer = TimeValueSerializer(g.run(node=pk), many=True)
        return Response(serializer.data)

# Create your views here.
def index(request):
    return render(request, 'calc/index.html')
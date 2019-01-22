# chat/routing.py
from django.conf.urls import url

from . import consumers

websocket_urlpatterns = [
    url(r'^ws/calc/(?P<node_run>[^/]+)/$', consumers.NodeRunConsumer)
]
from django.contrib import admin
from django.urls import path, include
from django.conf.urls import url
from . import views

app_name = 'calc'
urlpatterns = [
    path('', views.index, name='index'),
    url(r'^(?P<room_name>[^/]+)/$', views.room, name='room')
]

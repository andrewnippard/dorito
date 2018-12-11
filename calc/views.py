from django.shortcuts import render, HttpResponse
import csv

# Create your views here.
def index(request):
    return render(request, 'calc/index.html')

def data(request):
    with open('/Users/anippard/Programming/django_kubernetes/data.json', 'r') as f:
        return HttpResponse(f.read(), content_type='application/json')
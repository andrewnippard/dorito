from django.shortcuts import render, HttpResponse
import csv

# Create your views here.
def index(request):
    return render(request, 'calc/index.html')
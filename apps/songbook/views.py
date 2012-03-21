from django.shortcuts import render_to_response

def index(request):
    return render_to_response('songbook/index.html')

def chords(request):
    return render_to_response('songbook/chords.html')

def tabs(request):
    return render_to_response('songbook/tabs.html')

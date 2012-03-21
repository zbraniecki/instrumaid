from django.conf.urls.defaults import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns = patterns('songbook.views',
    # Examples:
    url(r'index2', 'tabs'),
    url(r'index', 'chords'),

)

urlpatterns += staticfiles_urlpatterns()

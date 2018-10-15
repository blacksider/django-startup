"""server URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.urls import include
from rest_auth.views import (LogoutView, UserDetailsView)

from server.trees.views import TreeView, TreeListView, TreeCreateView, TreeDestroyView

urlpatterns = {
    url(r'^api/', include(('timed_auth_token.urls', 'timed_auth_token'), namespace='auth'), name='login'),
    url(r'^api/logout/$', LogoutView.as_view(), name='logout'),
    url(r'^api/user/$', UserDetailsView.as_view(), name='user_details'),
    url(r'^api/tree/(?P<pk>\d+)$', TreeView.as_view(), name='tree_detail'),
    url(r'^api/tree/(?P<pk>\d+)/del$', TreeDestroyView.as_view(), name='tree_delete'),
    url(r'^api/trees/$', TreeListView.as_view(), name='tree_list'),
    url(r'^api/tree/$', TreeCreateView.as_view(), name='tree_save'),
}

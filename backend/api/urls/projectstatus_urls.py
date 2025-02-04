from django.urls import path
from api.views.projectstatus_views import ProjectStatusListView

urlpatterns = [
    path("", ProjectStatusListView.as_view(), name="project-status-list"),
]
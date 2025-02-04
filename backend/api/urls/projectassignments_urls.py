from django.urls import path
from api.views.projectassignments_views import ProjectAssignmentView

urlpatterns = [
    path("", ProjectAssignmentView.as_view({"get": "list", "post": "create"}), name="project-assignments"),
    path("<str:pk>/", ProjectAssignmentView.as_view({"get": "retrieve", "put": "update"}), name="project-assignment-detail"),
]
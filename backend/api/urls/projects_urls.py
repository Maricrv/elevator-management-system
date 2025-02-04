from django.urls import path
from api.views.projects_views import ProjectListView, ProjectDetailView

urlpatterns = [
    path("", ProjectListView.as_view(), name="project-list"),
    path("<str:pk>/", ProjectDetailView.as_view(), name="project-detail"),
]

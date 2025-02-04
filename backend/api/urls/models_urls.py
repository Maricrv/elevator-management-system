from django.urls import path
from api.views.models_views import ModelListView

urlpatterns = [
    path("", ModelListView.as_view(), name="model-list"),
]

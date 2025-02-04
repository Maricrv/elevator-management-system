from django.urls import path
from api.views.areas_views import AreaListView

urlpatterns = [
    path("", AreaListView.as_view(), name="area-list"),
]

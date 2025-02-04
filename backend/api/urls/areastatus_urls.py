from django.urls import path
from api.views.areastatus_views import AreaStatusListView

urlpatterns = [
    path("", AreaStatusListView.as_view(), name="area-status-list"),
]
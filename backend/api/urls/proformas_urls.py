from django.urls import path
from api.views.proformas_views import ProformaListView, ProformaDetailView

urlpatterns = [
    path("", ProformaListView.as_view(), name="proforma-list"),
    path("<int:pk>/", ProformaDetailView.as_view(), name="proforma-detail"),
]
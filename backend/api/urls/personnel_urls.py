from django.urls import path
from api.views.personnel_views import PersonnelListView, PersonnelDetailView

urlpatterns = [
    path("", PersonnelListView.as_view(), name='personnel-list'),
    path("<int:pk>/", PersonnelDetailView.as_view(), name='personnel-detail'),
]

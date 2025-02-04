from django.urls import path
from api.views.sales_views import SalesListView, SalesDetailView

urlpatterns = [
    path('', SalesListView.as_view(), name='sales-list'),
    path('<int:pk>/', SalesDetailView.as_view(), name='sales-detail'),
]
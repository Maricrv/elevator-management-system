from django.urls import path
from api.views.reports_views import UnitsReportView, ProjectsReportView, ProformasReportView, SalesReportView


urlpatterns = [
    path("units/", UnitsReportView.as_view(), name="reports-units"),
    path("projects/", ProjectsReportView.as_view(), name="reports-projects"),
    path("proformas/", ProformasReportView.as_view(), name="reports-proformas"),
    path("sales/", SalesReportView.as_view(), name="reports-sales"),
]

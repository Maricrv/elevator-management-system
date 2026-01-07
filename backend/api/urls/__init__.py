

from django.urls import include, path
print("api/urls/__init__.py is being executed")


urlpatterns = [
    path("clients/", include("api.urls.clients_urls")),
    path("projects/", include("api.urls.projects_urls")),
    path("sales/", include("api.urls.sales_urls")),
    path("models/", include("api.urls.models_urls")),
    path("personnel/", include("api.urls.personnel_urls")),
    path("areas/", include("api.urls.areas_urls")),
    path("project-statuses/", include("api.urls.projectstatus_urls")),
    path("project-assignments/", include("api.urls.projectassignments_urls")),
    path("area-statuses/", include("api.urls.areastatus_urls")),
    path("proformas/", include("api.urls.proformas_urls")),
    path("reports/", include("api.urls.reports_urls")),
    
]


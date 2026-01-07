from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from api.models import Projects, Sales, Proformas


# ✅ helper global (no DB changes)
def safe_text(v):
    if v is None:
        return ""
    if isinstance(v, (bytes, bytearray, memoryview)):
        return bytes(v).decode("utf-8", errors="replace")
    return str(v)


class ProjectsReportView(APIView):
    """
    Projects report
    Uses: projects + sales + clients + project_status + project_types
    """
    permission_classes = [AllowAny]

    def get(self, request):
        date_from = request.query_params.get("date_from")
        date_to = request.query_params.get("date_to")
        status_id = request.query_params.get("status") or ""   # expects numeric id
        type_id = request.query_params.get("type") or ""       # expects numeric id
        paid = request.query_params.get("paid") or ""          # "true" / "false" / ""
        q = (request.query_params.get("q") or "").strip()

        qs = Projects.objects.select_related("sale", "status", "type").all()

        # Date filters (project.start_date)
        if date_from:
            qs = qs.filter(Q(start_date__gte=date_from) | Q(start_date__isnull=True))
        if date_to:
            qs = qs.filter(Q(start_date__lte=date_to) | Q(start_date__isnull=True))

        # Filters by FK ids
        if status_id:
            qs = qs.filter(status_id=status_id)
        if type_id:
            qs = qs.filter(type_id=type_id)

        # Paid filter (from related sale)
        if paid in ("true", "false"):
            qs = qs.filter(sale__paid=(paid == "true"))

        # Search
        if q:
            qs = qs.filter(
                Q(project_id__icontains=q) |
                Q(project_name__icontains=q) |
                Q(sale__client__client_name__icontains=q)
            )

        rows = []
        for p in qs.order_by("-project_id")[:1000]:
            sale = getattr(p, "sale", None)

            rows.append({
                "project_id": safe_text(p.project_id),
                "project_name": safe_text(p.project_name),
                "start_date": str(p.start_date) if p.start_date else "",
                "end_date": str(p.end_date) if p.end_date else "",

                "status_id": p.status_id,
                "status": safe_text(p.status.description) if getattr(p, "status", None) else "",

                "type_id": p.type_id,
                "type": safe_text(p.type.type_name) if getattr(p, "type", None) else "",

                "sale_id": p.sale_id,
                "client_id": sale.client_id if sale else None,
                "price": float(sale.price) if sale and sale.price is not None else None,
                "paid": bool(sale.paid) if sale else False,
                "payment_date": str(sale.payment_date) if sale and sale.payment_date else "",
                "payment_method": safe_text(sale.payment_method) if sale else "",
                "proforma_id": sale.proforma_id if sale else None,
            })

        return Response({"rows": rows})


class UnitsReportView(APIView):
    """
    Units-style report (placeholder mapping)
    Uses existing Projects/Sales to fill unit-like fields for prototype.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        date_from = request.query_params.get("date_from")
        date_to = request.query_params.get("date_to")
        project_id = request.query_params.get("projectId") or ""
        status = request.query_params.get("status") or ""  # Operational/Maintenance/Out of service
        q = (request.query_params.get("q") or "").strip()

        qs = Projects.objects.select_related("sale").all()

        if project_id:
            qs = qs.filter(project_id=project_id)

        if q:
            qs = qs.filter(
                Q(project_id__icontains=q) |
                Q(project_name__icontains=q)
            )

        if date_from:
            qs = qs.filter(Q(start_date__gte=date_from) | Q(start_date__isnull=True))
        if date_to:
            qs = qs.filter(Q(start_date__lte=date_to) | Q(start_date__isnull=True))

        rows = []
        for p in qs.order_by("-project_id")[:500]:
            sale = getattr(p, "sale", None)

            paid = getattr(sale, "paid", None)
            mapped_status = "Operational" if paid else "Maintenance"

            if status and status != mapped_status:
                continue

            if getattr(p, "start_date", None):
                last_inspection = str(p.start_date)
            elif sale and getattr(sale, "payment_date", None):
                last_inspection = str(sale.payment_date)
            else:
                last_inspection = ""

            rows.append({
                "id": safe_text(p.project_id),
                "projectId": safe_text(p.project_id),
                "site": safe_text(getattr(p, "project_name", "") or ""),
                "unitType": "Project",
                "status": mapped_status,
                "lastInspection": last_inspection,
                "openIssues": 0,
            })

        return Response({"rows": rows})


class ProformasReportView(APIView):
    """
    Proformas report
    Uses: proformas + clients
    Fixes bytes/utf8 issues with safe_text()
    """
    permission_classes = [AllowAny]

    def get(self, request):
        date_from = request.query_params.get("date_from")
        date_to = request.query_params.get("date_to")
        status = (request.query_params.get("status") or "").strip()  # Pending/Accepted/Rejected
        converted = (request.query_params.get("converted") or "").strip()  # true/false/""
        q = (request.query_params.get("q") or "").strip()

        qs = Proformas.objects.select_related("client").all()

        if date_from:
            qs = qs.filter(Q(proforma_date__gte=date_from) | Q(proforma_date__isnull=True))
        if date_to:
            qs = qs.filter(Q(proforma_date__lte=date_to) | Q(proforma_date__isnull=True))

        if status:
            qs = qs.filter(status=status)

        if converted in ("true", "false"):
            qs = qs.filter(is_converted_to_sale=(converted == "true"))

        if q:
            qs = qs.filter(
                Q(proforma_id__icontains=q) |
                Q(project_name__icontains=q) |
                Q(client__client_name__icontains=q)
            )

        rows = []
        for p in qs.order_by("-proforma_id")[:1000]:
            client_obj = getattr(p, "client", None)

            rows.append({
                "proforma_id": safe_text(p.proforma_id),
                "client_id": p.client_id,
                "client_name": safe_text(getattr(client_obj, "client_name", "")),
                "project_name": safe_text(p.project_name),
                "proforma_date": str(p.proforma_date) if p.proforma_date else "",
                "valid_until": str(p.valid_until) if p.valid_until else "",
                "total_amount": float(p.total_amount) if p.total_amount is not None else None,
                "status": safe_text(p.status),
                "is_converted_to_sale": bool(p.is_converted_to_sale),
                "technical_details_pdf": safe_text(p.technical_details_pdf),
            })

        return Response({"rows": rows})


class SalesReportView(APIView):
    """
    Sales report
    Uses: sales + clients (+ model/proforma if present)
    """
    permission_classes = [AllowAny]

    def get(self, request):
        date_from = request.query_params.get("date_from")
        date_to = request.query_params.get("date_to")
        paid = request.query_params.get("paid") or ""   # "true" / "false" / ""
        q = (request.query_params.get("q") or "").strip()

        # If your Sales model doesn't have FK 'model' or 'proforma', remove them here.
        qs = Sales.objects.select_related("client", "model", "proforma").all()

        if date_from:
            qs = qs.filter(Q(payment_date__gte=date_from) | Q(payment_date__isnull=True))
        if date_to:
            qs = qs.filter(Q(payment_date__lte=date_to) | Q(payment_date__isnull=True))

        if paid in ("true", "false"):
            qs = qs.filter(paid=(paid == "true"))

        if q:
            qs = qs.filter(
                Q(sale_id__icontains=q) |
                Q(client__client_name__icontains=q) |
                Q(model__model_name__icontains=q) |
                Q(payment_method__icontains=q) |
                Q(notes__icontains=q)
            )

        rows = []
        for s in qs.order_by("-sale_id")[:1000]:
            client_obj = getattr(s, "client", None)
            model_obj = getattr(s, "model", None)

            rows.append({
                "sale_id": safe_text(s.sale_id),

                "client_id": s.client_id,
                "client_name": safe_text(getattr(client_obj, "client_name", "")),

                "model_id": s.model_id,
                "model_name": safe_text(getattr(model_obj, "model_name", "")),

                "price": float(s.price) if s.price is not None else None,
                "paid": bool(s.paid),
                "payment_date": str(s.payment_date) if s.payment_date else "",
                "payment_method": safe_text(s.payment_method),

                "proforma_id": s.proforma_id,
                "notes": safe_text(s.notes),
            })

        return Response({"rows": rows})

import logging
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from api.models import Proformas, Sales
from api.serializers import ProformaSerializer, SalesSerializer

# ✅ Set up logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

class ProformaListView(APIView):
    def get(self, request):
        proformas = Proformas.objects.all()
        serializer = ProformaSerializer(proformas, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ProformaSerializer(data=request.data)
        if serializer.is_valid():
            proforma = serializer.save()

            # ✅ Automatically create a Sale if status is "Accepted" at creation
            if proforma.status == "Accepted":
                with transaction.atomic():
                    sale = Sales.objects.create(
                        proforma=proforma,
                        client=proforma.client,
                        price=proforma.total_amount,
                        paid=False
                    )
                    proforma.is_converted_to_sale = True  # Mark Proforma as converted
                    proforma.save()

                logger.info(f"✅ Proforma {proforma.proforma_id} created with 'Accepted' status → Sale ID: {sale.sale_id}")

                return Response(
                    {"success": "Proforma created and Sale automatically generated!", "sale_id": sale.sale_id},
                    status=status.HTTP_201_CREATED
                )

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProformaDetailView(APIView):
    def get_object(self, pk):
        return get_object_or_404(Proformas, pk=pk)

    def get(self, request, pk):
        proforma = self.get_object(pk)
        serializer = ProformaSerializer(proforma)
        return Response(serializer.data)

    def put(self, request, pk):
        proforma = self.get_object(pk)
        old_status = proforma.status  # Store previous status

        # ✅ If no new file is uploaded, keep the old file
        data = request.data.copy()
        if "technical_details_pdf" not in request.FILES:  
            data["technical_details_pdf"] = proforma.technical_details_pdf  # Keep old file

        serializer = ProformaSerializer(proforma, data=data, partial=True)
        if serializer.is_valid():
            proforma = serializer.save()

            logger.info(f"✅ Proforma {pk} updated. Old Status: {old_status} → New Status: {proforma.status}")

            # ✅ Automatically create a Sale if status changed to "Accepted"
            if old_status != "Accepted" and proforma.status == "Accepted":
                if not Sales.objects.filter(proforma=proforma).exists():  # Ensure sale doesn't already exist
                    with transaction.atomic():
                        sale = Sales.objects.create(
                            proforma=proforma,
                            client=proforma.client,
                            price=proforma.total_amount,
                            paid=False
                        )
                        proforma.is_converted_to_sale = True  # Mark Proforma as converted
                        proforma.save()

                    logger.info(f"✅ Sale Automatically Created for Proforma {proforma.proforma_id} → Sale ID: {sale.sale_id}")

                    return Response(
                        {"success": "Proforma updated and Sale created automatically!", "sale_id": sale.sale_id},
                        status=status.HTTP_200_OK
                    )

            return Response(serializer.data, status=status.HTTP_200_OK)

        logger.error(f"❌ PUT /api/proformas/{pk}/ Error: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def delete(self, request, pk):
        proforma = self.get_object(pk)
        proforma.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

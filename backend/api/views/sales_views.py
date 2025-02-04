from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from api.models import Sales
from api.serializers import SalesSerializer

import logging

# Set up logging
logger = logging.getLogger(__name__)

# Custom Pagination Class
class SalesPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

# Sales List View (GET: List all sales, POST: Create a sale)
class SalesListView(ListCreateAPIView):
    queryset = Sales.objects.select_related("proforma").all()
    serializer_class = SalesSerializer
    pagination_class = SalesPagination
    permission_classes = [AllowAny]  

    def create(self, request, *args, **kwargs):
        print("🔍 Received Data:", request.data)  # ✅ Debugging incoming request

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            sale = serializer.save()  # ✅ Ensure sale object is saved
            logger.info(f"✅ Sale Created Successfully: {sale}")

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        logger.error(f"❌ Error creating sale: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Sales Detail View (GET: Retrieve, PUT: Update, DELETE: Delete a sale)
class SalesDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Sales.objects.all()
    serializer_class = SalesSerializer
    permission_classes = [AllowAny]

    def retrieve(self, request, *args, **kwargs):
        """ ✅ Fetch a sale and log details """
        try:
            sale = self.get_object()
            serializer = self.get_serializer(sale)
            logger.info(f"✅ Sale Retrieved: {serializer.data}")
            return Response(serializer.data)
        except Sales.DoesNotExist:
            logger.warning(f"⚠️ Sale with ID {kwargs['pk']} not found.")
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"❌ Error retrieving sale: {str(e)}")
            return Response({"detail": "An error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update(self, request, *args, **kwargs):
        """ ✅ Update a sale and handle errors """
        try:
            partial = kwargs.pop('partial', False)
            sale = self.get_object()
            serializer = self.get_serializer(sale, data=request.data, partial=partial)
            if serializer.is_valid():
                serializer.save()
                logger.info(f"✅ Sale Updated: {serializer.data}")
                return Response(serializer.data, status=status.HTTP_200_OK)

            logger.error(f"❌ Error updating sale: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Sales.DoesNotExist:
            logger.warning(f"⚠️ Sale with ID {kwargs['pk']} not found for update.")
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"❌ Error updating sale: {str(e)}")
            return Response({"detail": "An error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def destroy(self, request, *args, **kwargs):
        """ ✅ Delete a sale and handle errors """
        try:
            sale = self.get_object()
            sale.delete()
            logger.info(f"✅ Sale Deleted: {kwargs['pk']}")
            return Response({"detail": "Deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

        except Sales.DoesNotExist:
            logger.warning(f"⚠️ Sale with ID {kwargs['pk']} not found for deletion.")
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"❌ Error deleting sale: {str(e)}")
            return Response({"detail": "An error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

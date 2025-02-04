from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import Proformas
from api.serializers import ProformaSerializer


class ProformaListView(APIView):
    def get(self, request):
        proformas = Proformas.objects.all()
        serializer = ProformaSerializer(proformas, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ProformaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class ProformaDetailView(APIView):
    def get_object(self, pk):
        try:
            return Proformas.objects.get(pk=pk)
        except Proformas.DoesNotExist:
            return None

    def get(self, request, pk):
        proforma = self.get_object(pk)
        if proforma is None:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = ProformaSerializer(proforma)
        return Response(serializer.data)

    def put(self, request, pk):
        proforma = self.get_object(pk)
        if proforma is None:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = ProformaSerializer(proforma, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        proforma = self.get_object(pk)
        if proforma is None:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        proforma.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

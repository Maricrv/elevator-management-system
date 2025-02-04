from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import Personnel
from api.serializers import PersonnelSerializer

class PersonnelListView(APIView):
    def get(self, request):
        personnel = Personnel.objects.all()
        serializer = PersonnelSerializer(personnel, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = PersonnelSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PersonnelDetailView(APIView):
    """Handles retrieving, updating, and deleting a single personnel record"""

    def get_object(self, pk):
        try:
            return Personnel.objects.get(pk=pk)
        except Personnel.DoesNotExist:
            return None

    def get(self, request, pk):
        personnel = self.get_object(pk)
        if personnel is None:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = PersonnelSerializer(personnel)
        return Response(serializer.data)

    def put(self, request, pk):
        personnel = self.get_object(pk)
        if personnel is None:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = PersonnelSerializer(personnel, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        personnel = self.get_object(pk)
        if personnel is None:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        personnel.delete()
        return Response({"detail": "Deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

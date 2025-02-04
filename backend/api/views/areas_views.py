from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import AreaTypes
from api.serializers import AreaTypesSerializer

class AreaListView(APIView):
    def get(self, request):
        areas = AreaTypes.objects.all()
        serializer = AreaTypesSerializer(areas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import ElevatorModels
from api.serializers import ModelSerializer

class ModelListView(APIView):
    def get(self, request):
        models = ElevatorModels.objects.all()
        serializer = ModelSerializer(models, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

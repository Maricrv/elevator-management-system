from rest_framework.views import APIView
from rest_framework.response import Response
from api.models import AreaStatus
from api.serializers import AreaStatusSerializer

class AreaStatusListView(APIView):
    def get(self, request):
        statuses = AreaStatus.objects.all()
        serializer = AreaStatusSerializer(statuses, many=True)
        return Response(serializer.data)

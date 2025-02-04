from rest_framework.views import APIView
from rest_framework.response import Response
from api.models import ProjectStatus
from api.serializers import ProjectStatusSerializer

class ProjectStatusListView(APIView):
    def get(self, request):
        statuses = ProjectStatus.objects.all()
        serializer = ProjectStatusSerializer(statuses, many=True)
        return Response(serializer.data)

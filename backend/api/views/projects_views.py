from django.db.models import F
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import Projects
from api.serializers import ProjectSerializer

class ProjectListView(APIView):
    def get(self, request):
        # Use select_related to join the sales and clients tables
        projects = Projects.objects.select_related('sale__client').annotate(
            client_name=F('sale__client__client_name'),  # Annotate with the client name
            status_name=F('status__description'),
           
        )
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            # Fetch the project by its ID (ensure your database supports alphanumeric keys if pk is like "ascfas-1")
            project = Projects.objects.get(project_id=pk)

            # Deserialize and validate the incoming data
            serializer = ProjectSerializer(project, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()  # Save the updated project
                return Response(serializer.data, status=status.HTTP_200_OK)

            # Return validation errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Projects.DoesNotExist:
            # Return a descriptive 404 error
            return Response({"detail": f"Project with ID '{pk}' not found."}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            # Handle unexpected errors
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ProjectDetailView(APIView):
    def get_object(self, pk):
        try:
            return Projects.objects.select_related("sale__client").annotate(
                client_name=F("sale__client__client_name"),
                status_name=F('status__description'),
         

            ).get(pk=pk)
        except Projects.DoesNotExist:
            return None

    def get(self, request, pk):
        project = self.get_object(pk)
        if project is None:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

       
        serializer = ProjectSerializer(project)
        data = serializer.data
        data["client_name"] = project.client_name  # Add client_name manually
        data["status_name"] = project.status_name
        
        return Response(data)

    def put(self, request, pk):
        project = self.get_object(pk)
        if project is None:
            return Response({"detail": f"Project with ID '{pk}' not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProjectSerializer(project, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        project = self.get_object(pk)
        if project is None:
            return Response({"detail": f"Project with ID '{pk}' not found."}, status=status.HTTP_404_NOT_FOUND)

        try:
            project.delete()
            return Response({"detail": "Deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

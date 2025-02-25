from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework import generics
from django.shortcuts import get_object_or_404
from api.models import ProjectAssignmentAreaPersonnel
from api.serializers import ProjectAssignmentSerializer

class ProjectAssignmentView(viewsets.ModelViewSet):
    queryset = ProjectAssignmentAreaPersonnel.objects.all()
    serializer_class = ProjectAssignmentSerializer

    def retrieve(self, request, pk=None):
        """ Retrieves a project assignment using a composite key """
        try:
            print(f"🔍 Received ID: {pk}")  # Debugging to check what ID is received

            # Ensure ID follows correct format (e.g., "DP-15-2-6")
            if not pk or "-" not in pk:
                return Response({"detail": "Invalid ID format"}, status=status.HTTP_400_BAD_REQUEST)

            # Split the composite key
            parts = pk.rsplit("-", 2)  # Use `rsplit` in case project ID contains '-'
            
            if len(parts) != 3:
                return Response({"detail": "Invalid ID format"}, status=status.HTTP_400_BAD_REQUEST)

            project_id, area_id, personnel_id = parts

            try:
                area_id = int(area_id)
                personnel_id = int(personnel_id)
            except ValueError:
                return Response({"detail": "Error parsing ID components"}, status=status.HTTP_400_BAD_REQUEST)

            print(f"🔹 Parsed IDs -> Project: {project_id}, Area: {area_id}, Personnel: {personnel_id}")

            # Fetch the assignment using parsed values
            assignment = get_object_or_404(
                ProjectAssignmentAreaPersonnel,
                project__project_id=project_id,
                area__area_id=area_id,
                personnel__personnel_id=personnel_id
            )

            serializer = self.get_serializer(assignment)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except ProjectAssignmentAreaPersonnel.DoesNotExist:
            return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)


    def update(self, request, pk=None):
        """ 🔹 Update an assignment using composite key """
        try:
            project_id, area_id, personnel_id = pk.split("-")
            assignment = get_object_or_404(ProjectAssignmentAreaPersonnel,
                                           project__project_id=project_id,
                                           area__area_id=int(area_id),
                                           personnel__personnel_id=int(personnel_id))

            serializer = self.get_serializer(assignment, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response({"detail": "Invalid ID format"}, status=status.HTTP_400_BAD_REQUEST)
        except ProjectAssignmentAreaPersonnel.DoesNotExist:
            return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)
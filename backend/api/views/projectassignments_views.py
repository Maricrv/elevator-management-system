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
        """ 🔹 Obtiene un objeto basado en la clave compuesta """
        try:
            # Descomponer el ID compuesto
            project_id, area_id, personnel_id = pk.split("-")
            assignment = get_object_or_404(ProjectAssignmentAreaPersonnel,
                                           project__project_id=project_id,
                                           area__area_id=int(area_id),
                                           personnel__personnel_id=int(personnel_id))
            serializer = self.get_serializer(assignment)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ValueError:
            return Response({"detail": "Invalid ID format"}, status=status.HTTP_400_BAD_REQUEST)
        except ProjectAssignmentAreaPersonnel.DoesNotExist:
            return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)

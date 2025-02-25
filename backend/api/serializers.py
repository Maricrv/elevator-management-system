from rest_framework import serializers
from .models import Clients, Projects, Sales, ElevatorModels, Personnel, AreaTypes, ProjectStatus, ProjectAssignmentAreaPersonnel, AreaStatus, Proformas

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clients
        fields = '__all__'


class ProjectSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(read_only=True)  # Add this field
    status_name = serializers.CharField(source="status.description", read_only=True)  # Fetch status name

    class Meta:
        model = Projects
        fields = '__all__'  # Or explicitly include 'client_name' and other fields
    


class SalesSerializer(serializers.ModelSerializer):

    PAYMENT_METHODS = [
        ("BANK_TRANSFER", "Bank Transfer"),
        ("SEPA_DIRECT_DEBIT", "SEPA Direct Debit"),
        ("INVOICE", "Invoice"),
        ("CREDIT_CARD", "Credit Card"),
        ("CASH", "Cash"),
    ]

    payment_method = serializers.ChoiceField(choices=PAYMENT_METHODS, required=False, allow_null=True)  
    
    client_name = serializers.SerializerMethodField()
    proforma_id = serializers.IntegerField(write_only=True)  # ✅ Garantiza que `proforma_id` se envíe
    proforma_date = serializers.DateField(source="proforma.proforma_date", read_only=True)
    project_name = serializers.CharField(source="proforma.project_name", read_only=True)
    model_name = serializers.CharField(source="model.model_name", read_only=True)

    # ✅ Garantiza que `client_id` también se incluya en la solicitud
    client_id = serializers.IntegerField(write_only=True, required=True)

    class Meta:
        model = Sales
        fields = [
            "sale_id", "client_name", "client", "client_id",
            "proforma", "proforma_id", "proforma_date", "project_name","model_name",
            "price", "paid", "payment_date", "model", "payment_method", "notes"
        ]

    def get_client_name(self, obj):
        """ ✅ Maneja casos donde `proforma` puede ser `None` """
        return obj.proforma.client.client_name if obj.proforma and obj.proforma.client else None

    def validate(self, data):
        """
        ✅ Valida que la `Proforma` exista antes de guardar la venta.
        """
        proforma_id = data.get("proforma_id")

        # 1️⃣ Verifica que `proforma_id` fue enviado en la solicitud
        if not proforma_id:
            raise serializers.ValidationError({"proforma_id": "Este campo es obligatorio."})

        try:
            # 2️⃣ Verifica que la `Proforma` existe en la base de datos
            proforma = Proformas.objects.get(proforma_id=proforma_id)
        except Proformas.DoesNotExist:
            raise serializers.ValidationError({"proforma_id": "La proforma no existe."})

        # 3️⃣ Verifica que el `client_id` sea el mismo que el de la `Proforma`
        client_id = data.get("client_id")
        if proforma.client.client_id != client_id:
            raise serializers.ValidationError({"client_id": "El cliente no coincide con la proforma."})

        return data

    def create(self, validated_data):
        """
        ✅ Asigna correctamente la `Proforma` a la venta antes de guardarla.
        """
        client_id = validated_data.pop("client_id")  # Extrae `client_id`
        proforma_id = validated_data.pop("proforma_id")  # Extrae `proforma_id`

        # Asigna el objeto `Client` y `Proforma` correctamente
        validated_data["client"] = Clients.objects.get(client_id=client_id)
        validated_data["proforma"] = Proformas.objects.get(proforma_id=proforma_id)

        # Crea la venta (`Sale`)
        sale = Sales.objects.create(**validated_data)
        return sale

class ModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ElevatorModels
        fields = '__all__'

class PersonnelSerializer(serializers.ModelSerializer):
    area_name = serializers.CharField(source='area.area_name', read_only=True)  # Include Area Name

    class Meta:
        model = Personnel
        fields = '__all__'  # Include all fields

class AreaTypesSerializer(serializers.ModelSerializer):
    class Meta:
        model = AreaTypes
        fields = "__all__"  # Include all fields or specify the ones you need

class ProjectStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectStatus
        fields = "__all__"  # Include all fields or specify the ones you need

class ProjectAssignmentSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()  # Generates a unique ID based on the composite key
    project = serializers.CharField(source='project.project_id', required=True)
    area = serializers.IntegerField(source='area.area_id', required=True)
    personnel = serializers.IntegerField(source='personnel.personnel_id', required=True)
    area_status = serializers.IntegerField(source='area_status.area_status_id', required=False)
    area_name = serializers.CharField(source='area.area_name', read_only=True)  # Add area name
    personnel_name = serializers.SerializerMethodField()  # Generate personnel name
    status_description = serializers.CharField(source='area_status.description',  read_only=True) 
    
    class Meta:
        model = ProjectAssignmentAreaPersonnel
        fields = ('id', 'project', 'area', 'area_name', 'personnel', 'personnel_name', 'area_status', 'status_description')

    def get_id(self, obj):
        """ Generates a unique ID based on the composite key """
        return f"{obj.project.project_id}-{obj.area.area_id}-{obj.personnel.personnel_id}"

    def get_personnel_name(self, obj):
        """ Concatenate firstname and lastname to get personnel name """
        return f"{obj.personnel.firstname} {obj.personnel.lastname}"

    def create(self, validated_data):
        """ Handles the creation of the object with foreign keys manually """
        project_id = validated_data.pop("project")["project_id"]
        area_id = validated_data.pop("area")["area_id"]
        personnel_id = validated_data.pop("personnel")["personnel_id"]
        area_status_id = validated_data.pop("area_status", {}).get("area_status_id", None)

        project_instance = Projects.objects.get(project_id=project_id)
        area_instance = AreaTypes.objects.get(area_id=area_id)
        personnel_instance = Personnel.objects.get(personnel_id=personnel_id)
        area_status_instance = AreaStatus.objects.get(area_status_id=area_status_id) if area_status_id else None

        assignment, created = ProjectAssignmentAreaPersonnel.objects.get_or_create(
            project=project_instance,
            area=area_instance,
            personnel=personnel_instance,
            area_status=area_status_instance
        )

        return assignment



class AreaStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = AreaStatus
        fields = "__all__"  # Include all fields or specify the ones you need



class ProformaSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source="client.client_name", read_only=True)  # Fetch client name
    
    class Meta:
        model = Proformas
        fields = "__all__"  # Include all fields
        read_only_fields = ['proforma_id']  # Make the primary key read-only



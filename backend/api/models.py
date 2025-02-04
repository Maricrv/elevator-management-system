from django.db import models


# Existing Tables
class AreaStatus(models.Model):
    area_status_id = models.AutoField(primary_key=True)
    description = models.CharField(max_length=50)

    class Meta:
        db_table = 'area_status'


class AreaTypes(models.Model):
    area_id = models.AutoField(primary_key=True)
    area_name = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        db_table = 'area_types'


class Clients(models.Model):
    client_id = models.AutoField(primary_key=True)
    client_name = models.CharField(max_length=100, blank=True, null=True)
    client_abbreviation = models.CharField(max_length=8, blank=True, null=True)
    client_contact = models.CharField(max_length=50, blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.CharField(max_length=100, blank=True, null=True)
    postal_code = models.CharField(max_length=10, blank=True, null=True)
    city = models.CharField(max_length=50, blank=True, null=True)
    country = models.CharField(max_length=50, blank=True, null=True)
    email = models.EmailField(max_length=50, blank=True, null=True)
    project_count = models.IntegerField(default=0)

    class Meta:
        db_table = 'clients'


class ElevatorModels(models.Model):
    model_id = models.AutoField(primary_key=True)
    model_name = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        db_table = 'elevator_models'


class Personnel(models.Model):
    personnel_id = models.AutoField(primary_key=True)
    lastname = models.CharField(max_length=50, blank=True, null=True)
    firstname = models.CharField(max_length=50, blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(max_length=50, blank=True, null=True)
    area = models.ForeignKey(AreaTypes, on_delete=models.DO_NOTHING, blank=True, null=True)

    class Meta:
        db_table = 'personnel'


class ProjectAssignmentAreaPersonnel(models.Model):
    id = models.AutoField(primary_key=True)
    project = models.ForeignKey('Projects', on_delete=models.CASCADE, db_column='project_id')
    area = models.ForeignKey('AreaTypes', on_delete=models.CASCADE, db_column='area_id')
    personnel = models.ForeignKey('Personnel', on_delete=models.CASCADE, db_column='personnel_id')
    area_status = models.ForeignKey('AreaStatus', on_delete=models.SET_NULL, blank=True, null=True, db_column='area_status_id')

    class Meta:
        db_table = 'project_assignment_area_personnel'
        unique_together = ('project', 'area', 'personnel') 

    

class ProjectStatus(models.Model):
    status_id = models.AutoField(primary_key=True)
    description = models.CharField(max_length=50)

    class Meta:
        db_table = 'project_status'


class Projects(models.Model):
    project_id = models.CharField(primary_key=True, max_length=10)
    project_name = models.CharField(max_length=50, blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    sale = models.ForeignKey('Sales', on_delete=models.DO_NOTHING, blank=True, null=True)
    status = models.ForeignKey(ProjectStatus, on_delete=models.DO_NOTHING, blank=True, null=True)
    type = models.ForeignKey('ProjectTypes', on_delete=models.DO_NOTHING, blank=True, null=True)

    class Meta:
        db_table = 'projects'
    
    def __str__(self):
        return self.project_name



# New Tables
class Proformas(models.Model):
    proforma_id = models.AutoField(primary_key=True)
    client = models.ForeignKey(Clients, on_delete=models.CASCADE)
    project_name = models.CharField(max_length=50, unique=True, default="Unknown Project")
    proforma_date = models.DateField()
    valid_until = models.DateField()
    description = models.TextField(blank=True, null=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=[('Pending', 'Pending'), ('Accepted', 'Accepted'), ('Rejected', 'Rejected')])
    technical_details_pdf = models.FileField(upload_to='order_forms/', blank=True, null=True)  # Nuevo campo para el PDF
    
    class Meta:
        db_table = 'proformas'

class Sales(models.Model):
    sale_id = models.AutoField(primary_key=True)
    proforma = models.ForeignKey(Proformas, on_delete=models.CASCADE, blank=True, null=True, related_name="sales")
    client = models.ForeignKey(Clients, on_delete=models.CASCADE, null=True, blank=True)
    payment_method = models.CharField(max_length=50, blank=True, null=True)
    notes = models.CharField(max_length=256, blank=True, null=True)
    model = models.ForeignKey('ElevatorModels', on_delete=models.DO_NOTHING, blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    paid = models.BooleanField(blank=True, null=True)
    payment_date = models.DateField(blank=True, null=True)

    class Meta:
        db_table = 'sales'

class ProjectTypes(models.Model):
    type_id = models.AutoField(primary_key=True)
    type_name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'project_types'


class ElevatorConfigurations(models.Model):
    configuration_id = models.AutoField(primary_key=True)
    project = models.ForeignKey(Projects, on_delete=models.CASCADE)
    capacity = models.CharField(max_length=50, blank=True, null=True)
    speed = models.CharField(max_length=50, blank=True, null=True)
    door_type = models.CharField(max_length=50, blank=True, null=True)
    power_supply = models.CharField(max_length=50, blank=True, null=True)
    certification = models.CharField(max_length=50, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'elevator_configurations'


class Attachments(models.Model):
    attachment_id = models.AutoField(primary_key=True)
    project = models.ForeignKey(Projects, on_delete=models.CASCADE)
    file_name = models.CharField(max_length=255)
    file_path = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'attachments'


class Inventory(models.Model):
    item_id = models.AutoField(primary_key=True)
    item_name = models.CharField(max_length=255)
    model = models.ForeignKey(ElevatorModels, on_delete=models.DO_NOTHING, blank=True, null=True)
    quantity = models.IntegerField(default=0)
    reorder_level = models.IntegerField(default=0)

    class Meta:
        db_table = 'inventory'


class InventoryTransactions(models.Model):
    transaction_id = models.AutoField(primary_key=True)
    item = models.ForeignKey(Inventory, on_delete=models.CASCADE)
    transaction_type = models.CharField(max_length=20, choices=[('IN', 'IN'), ('OUT', 'OUT')])
    quantity = models.IntegerField()
    project = models.ForeignKey(Projects, on_delete=models.CASCADE, blank=True, null=True)
    transaction_date = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'inventory_transactions'


class MaintenanceRequests(models.Model):
    maintenance_id = models.AutoField(primary_key=True)
    project = models.ForeignKey(Projects, on_delete=models.CASCADE)
    client = models.ForeignKey(Clients, on_delete=models.CASCADE)
    description = models.TextField()
    requested_at = models.DateTimeField(auto_now_add=True)
    assigned_to = models.ForeignKey(Personnel, on_delete=models.SET_NULL, blank=True, null=True)
    status = models.CharField(max_length=20, choices=[('Pending', 'Pending'), ('In Progress', 'In Progress'), ('Resolved', 'Resolved')])
    resolved_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'maintenance_requests'


class MaintenanceLogs(models.Model):
    log_id = models.AutoField(primary_key=True)
    maintenance = models.ForeignKey(MaintenanceRequests, on_delete=models.CASCADE)
    work_done = models.TextField()
    parts_used = models.CharField(max_length=255, blank=True, null=True)
    hours_spent = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    updated_by = models.ForeignKey(Personnel, on_delete=models.CASCADE)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'maintenance_logs'

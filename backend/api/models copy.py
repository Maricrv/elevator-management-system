# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class AreaStatus(models.Model):
    area_status_id = models.AutoField(primary_key=True)
    description = models.CharField(max_length=50)

    class Meta:
        managed = False
        db_table = 'area_status'


class AreaTypes(models.Model):
    area_id = models.AutoField(primary_key=True)
    area_name = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = False
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
    email = models.CharField(max_length=50, blank=True, null=True)
    project_count = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'clients'



class ElevatorModels(models.Model):
    model_id = models.AutoField(primary_key=True)
    model_name = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'elevator_models'


class Personnel(models.Model):
    personnel_id = models.AutoField(primary_key=True)
    lastname = models.CharField(max_length=50, blank=True, null=True)
    firstname = models.CharField(max_length=50, blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    email = models.CharField(max_length=50, blank=True, null=True)
    area = models.ForeignKey(AreaTypes, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'personnel'


class ProjectAssignmentAreaPersonnel(models.Model):
    id = models.AutoField(primary_key=True)  # Surrogate primary key
    project = models.ForeignKey('Projects', on_delete=models.CASCADE)
    area = models.ForeignKey('AreaTypes', on_delete=models.CASCADE)
    personnel = models.ForeignKey('Personnel', on_delete=models.CASCADE)
    area_status = models.ForeignKey('AreaStatus', on_delete=models.SET_NULL, blank=True, null=True)

    class Meta:
        db_table = 'project_assignment_area_personnel'
        unique_together = (('project', 'area', 'personnel'),)  # Enforce composite uniqueness

    def __str__(self):
        return f"Assignment: {self.project} - {self.area} - {self.personnel}"


class ProjectStatus(models.Model):
    status_id = models.AutoField(primary_key=True)
    description = models.CharField(max_length=50)

    class Meta:
        managed = False
        db_table = 'project_status'


class Projects(models.Model):
    project_id = models.CharField(primary_key=True, max_length=10)
    project_name = models.CharField(max_length=50, blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    sale = models.ForeignKey('Sales', models.DO_NOTHING, blank=True, null=True)
    status = models.ForeignKey(ProjectStatus, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'projects'


class Sales(models.Model):
    sale_id = models.AutoField(primary_key=True)
    proforma = models.ForeignKey(Proformas, models.DO_NOTHING, blank=True, null=True) 
    client = models.ForeignKey(Clients, models.DO_NOTHING, blank=True, null=True)
    proforma_number = models.CharField(max_length=20, blank=True, null=True)
    proforma_date = models.DateField(blank=True, null=True)
    model = models.ForeignKey(ElevatorModels, models.DO_NOTHING, blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    paid = models.BooleanField(blank=True, null=True)
    payment_date = models.DateField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'sales'
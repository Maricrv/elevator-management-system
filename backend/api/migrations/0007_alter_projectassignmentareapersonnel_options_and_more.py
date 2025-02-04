# Generated by Django 5.1.3 on 2025-02-03 01:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_sales_client_sales_model'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='projectassignmentareapersonnel',
            options={'managed': False},
        ),
        migrations.AlterModelOptions(
            name='sales',
            options={'managed': False},
        ),
        migrations.AddField(
            model_name='proformas',
            name='project_name',
            field=models.CharField(default='Unknown Project', max_length=50, unique=True),
        ),
        migrations.AddField(
            model_name='proformas',
            name='technical_details_pdf',
            field=models.FileField(blank=True, null=True, upload_to='order_forms/'),
        ),
    ]

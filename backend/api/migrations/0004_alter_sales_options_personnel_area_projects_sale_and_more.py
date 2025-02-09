# Generated by Django 5.1.3 on 2024-12-07 05:03

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_projecttypes_alter_areastatus_options_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='sales',
            options={'managed': False},
        ),
        migrations.AddField(
            model_name='personnel',
            name='area',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='api.areatypes'),
        ),
        migrations.AddField(
            model_name='projects',
            name='sale',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='api.sales'),
        ),
        migrations.AddField(
            model_name='projects',
            name='status',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='api.projectstatus'),
        ),
        migrations.AddField(
            model_name='projects',
            name='type',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='api.projecttypes'),
        ),
        migrations.AlterField(
            model_name='clients',
            name='email',
            field=models.EmailField(blank=True, max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='clients',
            name='project_count',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='personnel',
            name='email',
            field=models.EmailField(blank=True, max_length=50, null=True),
        ),
    ]
